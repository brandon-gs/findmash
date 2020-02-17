import React from "react";
import "./Node.css";

const Node = ({ node, onClick }) => {
  const extraClass = node.isStart && node.isFinish 
    ? "node__maze--finish node__maze--start"
    : node.isStart
    ? "node__maze--start"
    : node.isFinish
    ? "node__maze--finish"
    : node.isWall
    ? "node__maze--wall"
    : "";

  
  return (
    <div
      className={`node__maze ${extraClass}`}
      id={`node-maze-${node.row}-${node.col}`}
      onClick={() => onClick(node.col, node.row)}
    >
      <p className="node__text--hide">
        {
        node.distance === Infinity 
        ? ""
        : node.distance === 0
        ? "Goal " + node.distance
        : node.distance
        }
      </p>
    </div>
  );
};

export default Node;
