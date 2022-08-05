import React, { useState } from 'react';
import classNames from 'classnames';
import jsonData from "./snippets.json"
import './App.css';
import { SetScore, UserData } from './util';

function App() {
  const inputRef = React.createRef();
  const [wpm, setWpm] = useState(0);
  // const [snippet, setSnippet] = useState("");
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
  const updateEnteredText = event => {
    let newNewText = event.target.value;
    let correctLength = gameState.snippet.startsWith(newNewText) ? newNewText.length : (gameState.correctLength || 0);
    console.log(correctLength, gameState.correctLength, newNewText.length)
    let totalTime = ((new Date() - gameState.startTime) / 1000).toFixed(2);
    let newWpm = updateTime(newNewText, totalTime)
    let wrongTexts = gameState.snippet.slice(correctLength, newNewText.length)
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
    // setInterval(waitAndshow, 1000);
  }

  const endRace = () => {
    let oldScore = UserData();
    if (Number(gameState.wpm) > oldScore) {
      SetScore(Number(gameState.wpm));
      setGameState({
        ...gameState,
        newHighestScore: true,
      })
      console.log(gameState)
    }
  }


  return (
    <div>
      <div className={
        classNames(
          "vh-100 vw-100 d-flex flex-column justify-content-center align-items-center",
          { "bg-success": gameState.victory, " bg-info": !gameState.victory, "bg-warning": gameState.wrongTexts?.length },
        )
      }
      >
        <span>{wpm}WPM</span>
        <span className='p-4' onClick={() => { if (inputRef.current) { inputRef.current.focus() } }}>
          <span className={classNames('text-success', { "text-muted": gameState.victory })}>
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
          <input ref={inputRef} className='m-4 opacity-0' value={gameState.enteredText} onChange={updateEnteredText} disabled={gameState.victory}></input>
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
