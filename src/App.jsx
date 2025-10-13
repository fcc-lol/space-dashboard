import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sun from "./views/Sun";
import Moon from "./views/Moon";
import { sunTheme, moonTheme } from "./theme";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sun" element={<Sun theme={sunTheme} />} />
        <Route path="/moon" element={<Moon theme={moonTheme} />} />
        <Route path="/" element={<Navigate to="/sun" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
