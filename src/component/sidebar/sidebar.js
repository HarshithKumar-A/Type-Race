import React from 'react';
import './sidebar.css'

export const SideBar = (props) => {
    return (
        <div>
            <ul className='sidebar-fin'>
                <li onClick={() => props.setGameMode(0)}>Classic</li>
                <li onClick={() => props.setGameMode(1)}>Racing</li>
                <li onClick={() => props.setGameMode(2)}>Meter</li>
                <li onClick={() => window.alert('Realtime Race Coming Soon...')}>War</li>
                {/* <li onClick={() => props.setGameMode(3)}>War</li> */}
            </ul>
            {props.gameMode?.scoreList?.[0] &&
                <div className='race_with_toper p-3'>Race With {props.gameMode?.scoreList?.[0]?.player_name} 🥇<div className='arrow'></div></div>
            }
        </div>
    )
}
