import React from 'react';
import './AboutPage.css'; // Import custom styles
import { FabOptions } from '../../component/Fab/Fab_Options';

const AboutPage = () => {
    const apps = [
        { name: 'Type Race', url: 'https://fin-race-harshithkumar-a.vercel.app/' },
        { name: 'Mafia', url: 'https://mafia-game-next.vercel.app/' },
        { name: 'Clip Board', url: 'https://clip-board-theta.vercel.app/login' },
        { name: 'Nopea', url: 'https://dap-admin-webapp-git-development-harshithkumar-a.vercel.app/login' },
        { name: 'react-quick-date-range-picker', url: 'https://www.npmjs.com/package/react-quick-date-range-picker' },

    ];

    const handleOpenApp = (url) => {
        window.open(url, '_blank');
    };

    return (
        <>
            <div className="about-page">

                <h3>Other Products</h3>
                <div className="app-cards-container">
                    {apps.map((app, index) => (
                        <div className="app-card" key={index}>
                            <iframe
                                src={app.url}
                                title={app.name}
                                className="app-iframe"
                            />
                            <div className="overlay">
                                <button
                                    className="open-button"
                                    onClick={() => handleOpenApp(app.url)}
                                >
                                    Open {app.name}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <FabOptions showOptionArray={['home', 'scoreboard']} />
        </>
    );
};

export default AboutPage;
