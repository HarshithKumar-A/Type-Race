import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import './war.css';

export default function War(props) {
    const wordsArray  = useState(['insia', 'hfkeh', 'djlejd']);
    
    return (
        <div className='war-console'>
            HERE THe WAR BEGINs
        </div>
    )
}
