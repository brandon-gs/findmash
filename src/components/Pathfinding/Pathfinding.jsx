import React, { useState, useEffect } from "react";
import Node from "./Node/Node.jsx";
import Alert from "./Alert/Alert.jsx";
import {
  dijkstra,
  getNodesInShortestPathOrder,
} from "../../algorithms/dijkstra";
import { getGridTemplateColumns } from "../../helpers";
import "./Pathfinding.css";

/* DEFAULT VALUES
const START_NODE_ROW = 6;
const START_NODE_COL = 1;
const FINISH_NODE_ROW = 1;
const FINISH_NODE_COL = Math.floor((window.screen.availWidth - 30) / 30) - 4;
*/

export default () => {
  const handleMouseDown = (row, col) => {
    if (currentNodeType === "wall") {
      const newNodes = getNewNodesWithWallToggled(nodes, row, col);
      setNodes(newNodes);
      setMousePressed(true);
    }
  };

  const handleMouseEnter = (row, col) => {
    if (currentNodeType === "wall") {
      if (!mousePressed) return;
      const newNodes = getNewNodesWithWallToggled(nodes, row, col);
      setNodes(newNodes);
    }
  };

  const handleMouseUp = () => {
    if (currentNodeType === "wall") setMousePressed(false);
  };

  const handleClick = (row, col) => {
    if (currentNodeType === "start") {
      setStartRow(row);
      setStartCol(col);
      setCurrentNodeType("finish"); // Next node type
    } else if (
      currentNodeType === "finish" &&
      (row !== startRow || col !== startCol)
    ) {
      setFinishRow(row);
      setFinishCol(col);
      setCurrentNodeType("wall"); // next node type
    } else if (currentNodeType === "wall" && isTouchDevice()) {
      const newNodes = getNewNodesWithWallToggled(nodes, row, col);
      setNodes(newNodes);
    }
  };

  /* 
  Restart values from nodes, except start and finish nodes
  */
  const newRoute = (nodes) => {
    setRunning(true);
    // *** Reset clases of visited nodes ***
    const visitedNodes = document.querySelectorAll(".node--visited");
    for (const node of visitedNodes) {
      node.classList.remove("node--visited");
    }

    // *** Reset clases of route path nodes***
    const pathNodes = document.querySelectorAll(".node-shortest-path");
    for (const node of pathNodes) {
      node.classList.remove("node-shortest-path");
    }

    // *** Change values of new walls in the nodes **
    const newNodes = nodes.slice();
    return newNodes.map((row) => {
      return row.map((node) => {
        return (node = {
          ...node,
          distance: Infinity,
          isVisited: false,
          previousNode: null,
        });
      });
    });
  };

  const animateDijkstra = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 50 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        const extraClass = node.isFinish
          ? "node--finish"
          : node.isStart
          ? "node--start"
          : "";
        const currentNodeElement = document.getElementById(
          `node-${node.row}-${node.col}`
        );
        currentNodeElement.className = `node ${extraClass} node--visited`;
      }, 50 * i);
    }
  };

  const animateShortestPath = (nodesInShortestPathOrder) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      // eslint-disable-next-line no-loop-func
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        if (node.isFinish) setRunning(false);
        document.getElementById(
          `node-${node.row}-${node.col}`
        ).className = node.isFinish
          ? "node node--finish node-shortest-path"
          : node.isStart
          ? "node node--start node-shortest-path"
          : "node node-shortest-path";
      }, 80 * i);
    }
  };

  const visualizeDijkstra = () => {
    setNodes(newRoute(nodes));
    const startNode = nodes[startRow][startCol];
    const finishNode = nodes[finishRow][finishCol];
    const visitedNodesInOrder = dijkstra(nodes, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    setTimeout(() => {
      animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }, 300);
  };

  window.addEventListener("resize", () => {
    setMaxCol(Math.floor((document.body.clientWidth - 30) / 30) - 2);
  });

  const resetNodes = (nodes) => {
    const newNodes = nodes.map((row, rowIdx) => {
      return row.map((node, nodeIdx) => {
        node.isStart = false;
        node.isFinish = false;
        node.isVisited = false;
        node.previousNode = null;
        node.isWall = false;
        node.distance = Infinity;
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node";
        return node;
      });
    });
    setStartRow(null);
    setStartCol(null);
    setFinishRow(null);
    setFinishCol(null);
    setCurrentNodeType("start");
    return newNodes;
  };

  const createNodes = (maxCol) => {
    const nodes = [];
    for (let row = 0; row < 10; row++) {
      const currentRow = [];
      for (let col = 0; col < maxCol; col++)
        currentRow.push(createNode(col, row));
      nodes.push(currentRow);
    }
    return nodes;
  };

  const createNode = (col, row) => {
    return {
      col,
      row,
      isStart: row === startRow && col === startCol,
      isFinish: row === finishRow && col === finishCol,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  };

  const [maxCol, setMaxCol] = useState(
    Math.floor((document.body.clientWidth - 30) / 30) - 2
  );
  const [running, setRunning] = useState(false);
  const [startRow, setStartRow] = useState(null);
  const [startCol, setStartCol] = useState(null);
  const [finishRow, setFinishRow] = useState(null);
  const [finishCol, setFinishCol] = useState(null);

  const [nodes, setNodes] = useState(createNodes());
  const [currentNodeType, setCurrentNodeType] = useState("start");
  const [mousePressed, setMousePressed] = useState(false);

  useEffect(() => {
    setNodes(createNodes(maxCol));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxCol, currentNodeType]);

  return (
    <div className="pathfinding" id="pathfinding">
      <Alert type={currentNodeType}></Alert>
      <div className="btn--container">
        <button
          className="btn--option"
          disabled={currentNodeType !== "wall" || running}
          onClick={() => visualizeDijkstra()}
        >
          Visualize Dijkstra's Algorithm
        </button>
        <button
          className="btn--reset"
          disabled={currentNodeType === "start" || running}
          onClick={() => setNodes(resetNodes(nodes))}
        >
          Reset
        </button>
      </div>

      <main
        className="grid"
        style={{ gridTemplateColumns: getGridTemplateColumns(maxCol, "30px") }}
      >
        {nodes.map((row, rowIdx) => {
          return (
            /*  <div key={`row-${rowIdx}`}> */
            <React.Fragment key={`row-${rowIdx}`}>
              {row.map((node, nodeIdx) => {
                const { row, col, isWall, isVisited, isStart, isFinish } = node;
                return (
                  <Node
                    key={`node-${nodeIdx}`}
                    row={row}
                    col={col}
                    isVisited={isVisited}
                    isWall={isWall}
                    isStart={isStart}
                    isFinish={isFinish}
                    onClick={(row, col) => handleClick(row, col)}
                    onMouseDown={(row, col) => handleMouseDown(row, col)}
                    onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                    onMouseUp={() => handleMouseUp()}
                  ></Node>
                );
              })}
            </React.Fragment>
            /* </div> */
          );
        })}
      </main>
    </div>
  );
};

function isTouchDevice() {
  let useragentmatch = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  return (
    useragentmatch ||
    "ontouchstart" in window ||
    // eslint-disable-next-line no-undef
    (window.DocumentTouch && document instanceof DocumentTouch)
  );
}

const getNewNodesWithWallToggled = (board, row, col) => {
  const newBoard = board.slice();
  const node = newBoard[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newBoard[row][col] = newBoard[row][col].isFinish
    ? node
    : newBoard[row][col].isStart
    ? node
    : newNode;
  return newBoard;
};
