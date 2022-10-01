import React, { useState, useEffect } from 'react';
import './sidebar.css'

export default function
    (props) {
    const gameMode = useState(props.gameMode);
    return (
        <div>
            <ul className='sidebar-fin'>
                <li onClick={() => props.setGameMode(0)}><a> Clasic</a></li>
                <li onClick={() => props.setGameMode(1)}><a> Racing </a></li>
                <li onClick={() => props.setGameMode(2)}><a >Meter </a></li>
            </ul>
        </div>
    )
}
