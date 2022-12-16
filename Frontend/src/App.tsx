import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./components/pages/home";
import NewPoll from "./components/pages/newPoll";
import Poll from "./components/pages/activePoll";
import Vote from "./components/pages/vote";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="Navbar">
        <Navbar />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/newPoll" element={<NewPoll />} />
        <Route path="/ActivePolls/:id" element={<Poll />} />
        <Route path="/vote/:id" element={<Vote />} />
      </Routes>
    </BrowserRouter>
  );
}
