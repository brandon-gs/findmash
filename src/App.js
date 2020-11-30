import React from "react";
import Pathfinding from "./components/Pathfinding/Pathfinding.jsx";
import Maze from "./components/Maze/Maze.jsx";
//import BinarySearch from "./components/BinarySearch/BinarySearch.jsx";
import scroll from "./scroll";
import "./App.css";
import Modal from "./components/Pathfinding/Modal/Modal.jsx";

function App() {
  return (
    <div className="App">
      <section className="menu">
        <button className="menu__btn" onClick={() => scroll("pathfinding")}>
          Pathfinding
        </button>
        <button className="menu__btn" onClick={() => scroll("maze")}>
          Maze
        </button>
      </section>
      <div style={{ height: "60px", width: "100vw" }}></div>
      <Modal />
      <Pathfinding></Pathfinding>
      <Maze></Maze>
    </div>
  );
}

export default App;
