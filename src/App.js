import React from 'react';
import './App.css';
import 'react-modern-drawer/dist/index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from './pages/home/home';
import ScoreBoard from './pages/scoreboard/score_board';

function App() {
  return (
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scores" element={<ScoreBoard />}>
        {/* <Route path="blogs" element={<Blogs />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NoPage />} /> */}
      </Route>
    </Routes>
  </BrowserRouter>
  );
}

export default App;
