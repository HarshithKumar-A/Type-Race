import React, { useEffect, useState } from 'react';
import './raceCanvas.css';

export default function RaceCanvas(props) {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        if (props.correctLength === 1 | props.correctLength === undefined) {
            setProgress(0)
        } else {
            setProgress((props.correctLength / props.totalLength) * 100);
        }
    });
    return (
        <div>
            <div style={{ paddingLeft: 'calc(' + progress + '% - 40px)' }} className='progress-bar'>
                <img src='1299198.svg' className='vehicle'></img>
            </div>
            <div className='progress-bar'>
                <img src='1299198.svg' className='vehicle'></img>
            </div>
            <div className='progress-bar'>
                <img src='1299198.svg' className='vehicle'></img>
            </div>
        </div>
    )
}
