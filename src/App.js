import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import jsonData from "./snippets.json"
import './App.css';
import Sidebar from './component/sidebar/sidebar';
import { SetScore, UserData } from './util';
import ReactSpeedometer from "react-d3-speedometer"
import RaceCanvas from './component/raceCanvas/RaceCanvas';
import { useSelector, useDispatch } from 'react-redux';
import { currentProgressOwn, currentSpeedProgress } from './redux/slice/raceSlice';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
import { Fab, Action } from 'react-tiny-fab';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css'

function App() {
  const correctAudio = new Audio('https://www.typingclub.com/m/audio/typewriter.mp3');
  const wrongAudio = new Audio('https://www.typingclub.com/m/audio/error.mp3');
  const inputRef = React.createRef();
  const { width, height } = useWindowSize()
  const [wpm, setWpm] = useState(0);
  const [gameModeNew, setGameMode] = useState(0);
  const [openBottomDrawer, setOpenBottomDrawer] = useState(false);
  const [bgUrl, setBgURL] = useState('/bg/bg3.jpg');
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
  const dispatch = useDispatch()
  useEffect(() => {
    chnageBG()
    sessionStorage.setItem('newGame', false);
    sessionStorage.setItem('GameStarted', false)
    const interval = setInterval(() => {
      if (sessionStorage.getItem('GameStarted') !== 'false') {
        let speed = (localStorage.getItem('Score') / sessionStorage.getItem('snippetLength')) * 1.6666666666666667
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
  }, []);

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
  }
  const toggleDrawer = () => {
    setOpenBottomDrawer((prevState) => !prevState)
  }

  const chnageBG = () => {
    const list = ['/bg/bg.jpg', '/bg/bg2.jpg', '/bg/bg3.jpg', '/bg/bg4.jpg', '/bg/bg5.jpg']
    setBgURL(list[Math.floor((Math.random()*list.length))])
  }

  return (
    <div>

      <Fab
        alwaysShowTitle={true}
        style={{ bottom: 0 }}
        icon="+"
      >
        <Action
          text="Background Images"
          onClick={() => { setOpenBottomDrawer(true) }}
        >
          <img src='picture.svg' className='vehicle'></img>
        </Action>
      </Fab>

      <Drawer
        open={openBottomDrawer}
        onClose={toggleDrawer}
        direction='bottom'
        className='bla bla bla'
      >
        <div>From Here You Can Select Background Images</div>
      </Drawer>

      <Confetti
        width={width}
        height={height}
        run={gameFinished}
      />
      <Sidebar gameMode={gameModeNew} setGameMode={setGameMode} />
      <div className='background-wallpaper' style={{backgroundImage: 'url(' + bgUrl + ')'}}></div>
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
        <span className={classNames("w-95 text-canvas", { "d-none": gameModeNew !== 1 })}>
          <RaceCanvas totalLength={gameState.snippet.split(/\s+/).length} correctLength={gameState.correctText?.split(/\s+/).length} race1={race.progressOpenenet1} />
        </span>
        <span className={classNames({ "d-none": gameModeNew === 2 })}>{wpm}WPM</span>
        <span className='p-4 text-canvas w-95 text-center' onClick={() => { if (inputRef.current) { inputRef.current.focus() } }}>
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
      <span className='position-absolute bottom-0 end-0'>highest score : {UserData()}WPM</span>
    </div>
  );
}

export default App;
