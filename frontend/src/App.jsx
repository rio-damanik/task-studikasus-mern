// src/App.jsx

import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import "./App.css";

function App() {
  const [selectedTag, setSelectedTag] = useState("");

  return (
    <>
      <Navbar onCategorySelect={setSelectedTag} />
      <Outlet context={{ selectedTag }} />
    </>
  );
}

export default App;
