import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { increment, decrement, currentSpeed } from '../../redux/slice/raceSlice';
import './raceCanvas.css';

export default function RaceCanvas(props) {
    const bootProgrss = useSelector(state => state.race.bootProgress);
    const userProgress = useSelector(state => state.race.myProgress);

    const [positions, setPosition] = useState([1, 2, 3])

    useEffect(() => {
        let score = [userProgress, bootProgrss, bootProgrss * 1.4]
        let sorted = score.slice().sort(function (a, b) { return b - a })
        let ranks = score.map(function (v) { return sorted.indexOf(v) + 1 });
        setPosition(ranks)
    }, [bootProgrss]);

    return (
        <div>
            <div style={{ paddingLeft: 'calc(' + userProgress + '% - 50px)' }} className='progress-bar'>
                <div className='vehicle'>
                    <span className='vehicle'>{positions[0]}</span>
                    <img src='1299198.svg' className='vehicle'></img>
                </div>
            </div>
            <div style={{ paddingLeft: 'calc(' + (bootProgrss < 100 ? bootProgrss : 100) + '% - 50px)' }} className='progress-bar'>
                <div className='vehicle'>
                    <span className='vehicle'>{positions[1]}</span>
                    <img src='1299198.svg' className='vehicle'></img>
                </div>
            </div>
            <div style={{ paddingLeft: 'calc(' + (bootProgrss * 1.4 < 100 ? bootProgrss * 1.4 : 100) + '% - 50px)' }} className='progress-bar'>
                <div className='vehicle'>
                    <span className='vehicle'>{positions[2]}</span>
                    <img src='1299198.svg' className='vehicle'></img>
                </div>
            </div>

            <span>{bootProgrss}</span>
        </div>
    )
}
