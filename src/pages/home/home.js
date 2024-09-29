import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import jsonData from "../../snippets.json"
import './home.css';
import { SideBar } from '../../component/sidebar/sidebar';
import { SetScore, UserData, setStorage, getStaorage } from '../../util';
import ReactSpeedometer from "react-d3-speedometer"
import RaceCanvas from '../../component/raceCanvas/RaceCanvas';
import { useSelector, useDispatch } from 'react-redux';
import { currentProgressOwn, currentSpeedProgress } from '../../redux/slice/raceSlice';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
import 'react-modern-drawer/dist/index.css';
import { useNavigate } from "react-router-dom";
import Modal from 'react-modal';
import FontSizeChanger from 'react-font-size-changer';
import War from '../../component/War/war';
import { FabOptions } from '../../component/Fab/Fab_Options';

const correctAudio = new Audio('https://www.typingclub.com/m/audio/typewriter.mp3');
const wrongAudio = new Audio('https://www.typingclub.com/m/audio/error.mp3');

const IMAGE_LIST = ['/bg/bg.jpg', '/bg/bg2.jpg', '/bg/bg3.jpg', '/bg/bg4.jpg', '/bg/bg5.jpg']

function Home() {
  const inputRef = React.createRef();
  const [scoreList, setScoreList] = useState([]);
  const [wpm, setWpm] = useState(0);
  const [gameModeNew, setGameMode] = useState(0);
  const [bgUrl, setBgURL] = useState('/bg/bg3.jpg');
  const [isModalOpen, setModal] = useState(false);
  const [gameState, setGameState] = useState({
    started: false,
    victory: false,
    startTime: null,
    totalTime: null,
    wpm: 0,
    snippet: "",
    snippetLength: undefined,
    enteredText: '',
    correctLength: 0,
    correctText: '',
    yetToBeEntered: "click 'Start Race' to begin the race",
    wrongTexts: '',
    newHighestScore: false,
  });
  const [gameFinished, setGameFinished] = useState(false)
  const [race, setRace] = useState({
    progressOpenenet1: 0,
    progressOpenenet2: 0,
  })

  const { width, height } = useWindowSize()
  let navigate = useNavigate();
  const dispatch = useDispatch()

  useEffect(() => {
    isNewUser()
    getScoreBoard()
    changeBG()
    sessionStorage.setItem('newGame', false);
    sessionStorage.setItem('GameStarted', false)
    const interval = setInterval(() => {
      if (sessionStorage.getItem('GameStarted') !== 'false') {
        let speed
        if (scoreList.length) {
          speed = (scoreList[0].score / sessionStorage.getItem('snippetLength')) * 1.6666666666666667
        } else {
          speed = (localStorage.getItem('Score') / sessionStorage.getItem('snippetLength')) * 1.6666666666666667
        }
        if (sessionStorage.getItem('newGame') === 'true') {
          race.progressOpenenet1 = 0
          sessionStorage.setItem('newGame', false)
        } else {
          race.progressOpenenet1 = race.progressOpenenet1 + speed;
        }
        dispatch(currentSpeedProgress(race.progressOpenenet1));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const updateEnteredText = event => {
    let newNewText = event.target ? event.target.value : event;
    let correctLength = gameState.snippet.startsWith(newNewText) ? newNewText.length : (gameState.correctLength || 0);
    let totalTime = ((new Date() - gameState.startTime) / 1000).toFixed(2);
    let newWpm = updateTime(newNewText, totalTime)
    let wrongTexts = gameState.snippet.slice(correctLength, newNewText.length);
    if (wrongTexts.length === 0) {
      correctAudio.play();
    } else {
      wrongAudio.play();
    }
    dispatch(currentProgressOwn(correctLength * 100 / gameState.snippet.length))
    setGameState({
      ...gameState,
      wpm: newWpm,
      enteredText: newNewText,
      correctLength: correctLength,
      correctText: gameState.snippet.slice(0, correctLength),
      wrongTexts: wrongTexts,
      yetToBeEntered: gameState.snippet.slice(newNewText.length),
    });

    if (newNewText === gameState.snippet) {
      setGameState({
        ...gameState,
        victory: true,
        totalTime: totalTime,
      });
      endRace()
    }
  }

  const updateTime = (newText, totalTime) => {
    setWpm((newText.split(/\s+/).length === 1 ? 0 : (newText.split(/\s+/).length * 60) / totalTime).toFixed(2));
    return wpm;
  }

  const startRace = (oldSnippet) => {
    sessionStorage.setItem('newGame', true);
    sessionStorage.setItem('GameStarted', true);
    dispatch(currentProgressOwn(0))
    // let bootProgress;
    setRace({
      progressOpenenet1: 0,
      progressOpenenet2: 0,
    });
    // bootProgress = window.setInterval(
    //   () => {
    //     race.progressOpenenet1 = race.progressOpenenet1 + 1;
    //     race.progressOpenenet2 = race.progressOpenenet2 + 2;
    //     dispatch(currentSpeedProgress(race.progressOpenenet1));
    //     // console.log(document.getElementById('input-box').value.length);
    //     // document.getElementById('input-box').value && updateEnteredText(document.getElementById('input-box').value)
    //   }
    //   , 1000);
    // clearInterval(bootProgress);
    let snippet = oldSnippet ? oldSnippet : jsonData[Math.floor(Math.random() * jsonData.length)];
    inputRef.current.focus()
    setGameState({
      started: true,
      victory: false,
      startTime: new Date(),
      snippet: snippet,
      yetToBeEntered: snippet,
      snippetLength: gameState.snippet.split(/\s+/).length,
      enteredText: '',
      newHighestScore: false,
    })
    sessionStorage.setItem('snippetLength', snippet.split(/\s+/).length);
    // setInterval(waitAndshow, 1000);
  }

  const endRace = () => {
    let oldScore = UserData();
    setGameFinished(true)
    if (Number(gameState.wpm) > oldScore) {
      SetScore(Number(gameState.wpm));
      setGameState({
        ...gameState,
        newHighestScore: true,
      })
      console.log(gameState)
    }
    postUserScore();

  }

  const postUserScore = () => {

    const userPrevScore = scoreList.filter((elm) => elm.name === getStaorage('User_Detail').id);
    console.log(userPrevScore, Number(gameState.wpm))
    if (userPrevScore.length === 0 || userPrevScore[0]?.score < Number(gameState.wpm)) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: getStaorage('User_Detail').id, score: Number(gameState.wpm) })
      };
      fetch(process.env.REACT_APP_API_PORT + '/leadboard/', requestOptions)
        .then(response => navigate('/scores'))
    }
    //  else if (userPrevScore[0]?.score < Number(gameState.wpm)) {

    //   const requestOptions = {
    //     method: 'DELETE',
    //     headers: { 
    //       'Access-Control-Allow-Origin': 'http://localhost:3000/',
    //       'Access-Control-Allow-Methods': 'PUT,PATCH,DELETE',
    //       'Access-Control-Allow-Headers': 'API-Key,Content-Type,If-Modified-Since,Cache-Control',
    //       'Access-Control-Max-Age': '86400'
    //      },
    //     body: JSON.stringify({ name: getStaorage('User_Detail').id, score: Number(gameState.wpm) })
    //   };
    //   fetch(process.env.REACT_APP_API_PORT + '/leadboard/' + userPrevScore[0].id, requestOptions)
    //     .then(response => navigate('/scores'))
    // }
    else {
      navigate('/scores')
    }


  }

  const getScoreBoard = () => {
    fetch(process.env.REACT_APP_API_PORT + "/leadboard/")
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result);
          setScoreList(result)
        },
        (error) => {
          console.log(error)
        }
      )
  }


  const changeBG = () => {
    setBgURL(IMAGE_LIST[Math.floor((Math.random() * IMAGE_LIST.length))])
  }

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '370px',
    },
  };

  const isNewUser = () => {
    setModal(getStaorage('User_Detail') ? false : true);
  }

  const registerUser = () => {
    const userName = document.getElementById("user_name").value;
    const nameRegex = /^[a-zA-Z]+$/;
    if (nameRegex.test(userName) && userName.length > 4) {
      // const requestOptions = {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ "name": userName  && userName.length > 6})
      // };
      // fetch(process.env.REACT_APP_API_PORT + '/players/', requestOptions)
      //   .then(response => response.json())
      //   .then(res => {
      //     if (res.id) {
      //       setStorage('User_Detail', res);
      //       isNewUser();
      //     } else {
      //       alert(res.name)
      //     }
      //   })
      document.getElementById("error").innerText = '';
    } else {
      document.getElementById("error").innerText = 'The name appears to be not valid..'
    }
  }

  return (
    <div>
      <Modal
        isOpen={true}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div>Enter Name</div>
        <input className='form-control mb-2' id="user_name" />
        <span id='error' className=''></span>
        <button onClick={() => registerUser()} className='form-control btn btn-primary mt-2'>Submit</button>
      </Modal>

      <Confetti
        width={width}
        height={height}
        run={gameFinished}
      />

      <SideBar gameMode={{ mode: gameModeNew, scoreList: scoreList, gameStarted: gameState.started }} setGameMode={setGameMode} />
      <div className='background-wallpaper' style={{ backgroundImage: 'url(' + bgUrl + ')' }}></div>
      <div className={

        classNames(
          "vh-100 vw-100 d-flex flex-column justify-content-center align-items-center",
          { "bg-success": gameState.victory, " bg-info-test": !gameState.victory, "bg-warning": gameState.wrongTexts?.length },
        )
      }
      >
        <span className={classNames("d-flex justify-content-center text-canvas w-95", { "d-none": gameModeNew !== 2 })}>
          <ReactSpeedometer
            minValue={0}
            maxValue={100}
            value={wpm}
            height={325}
            width={600}
            currentValueText={`${wpm}WPM`}
            textColor={'#fff'}
            needleColor='#b9dfff'
          />
        </span>
        <span className={classNames("d-flex justify-content-center text-canvas w-95", { "d-none": gameModeNew !== 3 })}>
          <War />
        </span>
        <span className={classNames("w-95 text-canvas", { "d-none": gameModeNew !== 1 })}>
          <RaceCanvas totalLength={gameState.snippet.split(/\s+/).length} correctLength={gameState.correctText?.split(/\s+/).length} race1={race.progressOpenenet1}
            scoreList={scoreList[0]} />
        </span>
        <div style={{ width: '90%' }}>
          <span className={classNames({ "d-none": gameModeNew === 2 })}>{wpm}WPM</span>
          <FontSizeChanger
            targets={['#target-one']}
            options={{
              stepSize: 2,
              range: 40
            }}
          />
        </div>
        <span id="target-one" className='p-4 text-canvas w-95 text-center' onClick={() => { if (inputRef.current) { inputRef.current.focus() } }}>
          <span className={classNames('text-success bg-white', { "text-muted": gameState.victory })}>
            {gameState.correctText}
          </span>
          <span className='bg-danger'>{gameState.wrongTexts}</span>
          <span className={classNames({ "text-muted": gameState.victory })}>
            {gameState.yetToBeEntered}
          </span>
        </span>
        <div className='col-4 d-flex justify-content-around'>
          <button onClick={() => startRace(false)} className="col-5 btn btn-light">{gameState.started ? "Restart" : "Start"} Race</button>
          {gameState.started && <button onClick={() => startRace(gameState.snippet)} className="col-5 btn btn-light">Retry This Snippet</button>}
          {!gameState.started && <button onClick={() => navigate('/scores')} className="col-5 btn btn-light">View ScoreBoard</button>}
        </div>
        <div className='position-relative'>
          <input ref={inputRef} className='m-4 opacity-0' value={gameState.enteredText} onChange={updateEnteredText} disabled={gameState.victory} id='input-box'></input>
          <span className='position-absolute col-12 h-100 start-0 text-center'>
            {
              (gameState.victory && !gameState.newHighestScore) && `${gameState.snippetLength} words in ${gameState.totalTime} seconds`
            }
            {gameState.newHighestScore && `Boom new Highest score`}

          </span>
        </div>
      </div>
      <span className='position-absolute bottom-0 end-0'>Your highest score : {UserData()}WPM</span>
      <FabOptions setBgURL={setBgURL} showOptionArray={['about', 'scoreboard', 'bg-list']} />
    </div>
  );
}

export default Home;
