import React, { useState, useEffect } from 'react';
import './score_board.css';
import { FabOptions } from '../../component/Fab/Fab_Options';

export default function ScoreBoard() {
    const [scorelist, setScoreList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(process.env.REACT_APP_API_PORT + "/leadboard/")
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    setScoreList(getUniqueScore(result));
                    setLoading(false);
                },
                (error) => {
                    console.log(error);
                    setLoading(false);
                }
            );
    }, []);

    const getUniqueScore = (scores) => {
        const dict = new Set();
        const result = [];
        scores.forEach((elm) => {
            if (!dict.has(elm.name)) {
                result.push(elm);
                dict.add(elm.name);
            }
        });
        return result;
    };

    const scoreList = scorelist.map((elm, index) => (
        <li key={elm.name}>
            <mark>{elm.player_name} {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''}</mark>
            <small>{elm.score}</small>
        </li>
    ));

    return (
        <>
            <div className="container mt-4 p-3 round">
                <div className="leaderboard">
                    <div className="head">
                        <i className="fas fa-crown"></i>
                        <h1>Score Board</h1>
                    </div>
                    <div className="body">
                        {loading ? (
                            <div className="loader"></div>
                        ) : (
                            <ol>
                                {scoreList}
                            </ol>
                        )}
                    </div>
                </div>
            </div>
            <FabOptions showOptionArray={['home', 'about']} />
        </>
    );
}
