import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sun from "./views/Sun";
import Earth from "./views/Earth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sun" element={<Sun />} />
        <Route path="/earth" element={<Earth />} />
        <Route path="/" element={<Navigate to="/sun" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
