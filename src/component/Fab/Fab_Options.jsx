import React, { useState, useCallback } from 'react';
import { Fab, Action } from 'react-tiny-fab';
import Drawer from 'react-modern-drawer';
import { useNavigate } from 'react-router-dom';

const IMAGE_LIST = ['/bg/bg.jpg', '/bg/bg2.jpg', '/bg/bg3.jpg', '/bg/bg4.jpg', '/bg/bg5.jpg'];

export const FabOptions = ({ setBgURL, showOptionArray = [] }) => {
    const [openBottomDrawer, setOpenBottomDrawer] = useState(false);
    const navigate = useNavigate();

    const toggleDrawer = useCallback(() => {
        setOpenBottomDrawer(prevState => !prevState);
    }, []);

    return (
        <>
            <Fab alwaysShowTitle={true} style={{ bottom: 0 }} icon="+">
                {showOptionArray.includes('bg-list') && (
                    <Action text="Background Images" onClick={toggleDrawer}>
                        <img src="picture.svg" className="vehicle" alt="Background Images" />
                    </Action>
                )}
                {showOptionArray.includes('scoreboard') && (
                    <Action text="View Score Board" onClick={() => navigate('/scores')}>
                        <img src="crown.svg" className="vehicle" alt="Scoreboard" />
                    </Action>
                )}
                {showOptionArray.includes('about') && (
                    <Action text="Other Products.." onClick={() => navigate('/about')}>
                        🛸  
                    </Action>
                )}
                {showOptionArray.includes('home') && (
                    <Action text="Home" onClick={() => navigate('/')}>
                        🛖
                    </Action>
                )}
            </Fab>

            <Drawer open={openBottomDrawer} onClose={toggleDrawer} direction="bottom" className="overflow-auto">
                <div className="d-flex flex-wrap gap-2 m-2 me-0">
                    {IMAGE_LIST.map(image => (
                        <img
                            key={image}
                            src={image}
                            className="bg-options"
                            alt="Background option"
                            onClick={() => setBgURL(image)}
                        />
                    ))}
                </div>
            </Drawer>
        </>
    );
};
