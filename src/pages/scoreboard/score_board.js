import React, { useState } from 'react'
import { useEffect } from 'react';
import './score_board.css'

export default function ScoreBoard() {

    const [scorelist, setScoreList] = useState([])

    useEffect(() => {
        fetch(process.env.REACT_APP_API_PORT + "/leadboard/")
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    setScoreList(getUniqueScore(result))
                },
                (error) => {
                    console.log(error)                                                                                                                                                                  
                }
            )

        // const requestOptions = {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({name: 2,score: 123})
        // };
        // fetch('http://127.0.0.1:8000/leadboard/', requestOptions)
        //     .then(response => response.json())

    }, [])

    const getUniqueScore = (scores) => {
        const dict = new Set
        const result = []
        scores.forEach((elm) => {
            if (!dict.has(elm.name)) {
                result.push(elm)
                dict.add(elm.name)
            }
        })
        return result
    }

    const scoreList = scorelist.map((elm) => {
        return (
            <li>
                <mark>{elm.player_name}</mark>
                <small>{elm.score}</small>
            </li>
        );
    })

    return (
        <div>
            <div className="container">
                <div className="leaderboard">
                    <div className="head">
                        <i className="fas fa-crown"></i>
                        <h1>Score Board</h1>
                    </div>
                    <div className="body">
                        <ol>
                            {scoreList}
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    )
}
