import React from "react";
import "./Node.css";
import { FaChevronRight } from "react-icons/fa";
import { FiTarget } from 'react-icons/fi';
export default ({
  col,
  row,
  isVisited,
  isFinish,
  isStart,
  isWall,
  onClick,
  onMouseDown,
  onMouseEnter,
  onMouseUp
}) => {
  const extraClassName = isFinish
    ? "node--finish"
    : isStart
    ? "node--start"
    : isWall
    ? "node--wall"
    : "";

  const color =
    isFinish && isVisited ? "red" : isStart && isVisited ? "green" : "";

  const Icon = isFinish ? (
    <FiTarget />
  ) : isStart ? (
    <FaChevronRight />
  ) : null;

  return (
    <div
      id={`node-${row}-${col}`}
      className={`node ${extraClassName}`}
      style={{ color }}
      onClick={() => onClick(row, col)}
      onMouseDown={() => onMouseDown(row, col)}     
      onTouchStart={() => onMouseDown(row, col)} 
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
    >
      {Icon}
    </div>
  );
};
