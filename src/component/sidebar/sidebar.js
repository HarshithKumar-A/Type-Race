import React, { useState, useEffect } from 'react';
import './sidebar.css'

export default function
    (props) {
    const gameMode = useState(props.gameMode.mode);
    console.log(props);
    return (
        <div>
            <ul className='sidebar-fin'>
                <li onClick={() => props.setGameMode(0)}><a> Clasic</a></li>
                <li onClick={() => props.setGameMode(1)}><a> Racing </a></li>
                <li onClick={() => props.setGameMode(2)}><a >Meter </a></li>
                <li onClick={() => props.setGameMode(3)}><a >War </a></li>
            </ul>
            {
                props.gameMode.mode !== 1 && !props.gameMode.gameStarted &&
                <div className='race_with_toper p-3'>Race With {props.gameMode.scorelist[0]?.player_name} <div className='arrow'></div></div>
            }
        </div>
    )
}
