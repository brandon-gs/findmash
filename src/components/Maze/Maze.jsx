import React, { useState, useEffect } from "react";
import Node from "./Node/Node.jsx";
import "./Maze.css";

const ROWS = 8;
const COLS = 8;
const NODE_START_ROW = 3;
const NODE_START_COL = 3;

// [COL, ROW]
const WALLS = [
  [0, 0],
  [1, 0],
  [2, 0],
  [3, 0],
  [4, 0],
  [6, 0],
  [7, 0],
  [0, 1],
  [7, 1],
  [0, 2],
  [2, 2],
  [3, 2],
  [4, 2],
  [5, 2],
  [7, 2],
  [0, 3],
  [2, 3],
  [4, 3],
  [7, 3],
  [0, 4],
  [2, 4],
  [4, 4],
  [5, 4],
  [7, 4],
  [0, 5],
  [2, 5],
  [4, 5],
  [7, 5],
  [0, 6],
  [7, 6],
  [0, 7],
  [1, 7],
  [2, 7],
  [3, 7],
  [4, 7],
  [5, 7],
  [6, 7],
  [7, 7]
];

var isRunning = false;

const Maze = () => {
  // *** START NODE & FINISH NODE STATE ***
  const [nodeStartRow, setNodeStartRow] = useState(NODE_START_ROW);
  const [nodeStartCol, setNodeStartCol] = useState(NODE_START_COL);
  const [nodeFinishRow, setNodeFinishRow] = useState(null);
  const [nodeFinishCol, setNodeFinishCol] = useState(null);

  // *** FUNCTIONS ***

  const createNode = (col, row) => {
    return {
      col,
      row,
      isStart: row === nodeStartRow && col === nodeStartCol,
      isFinish: row === nodeFinishRow && col === nodeFinishCol,
      isWall: false,
      isVisited: false,
      distance: Infinity
    };
  };

  const createNodes = () => {
    const nodes = [];
    for (let row = 0; row < ROWS; row++) {
      const rowNodes = [];
      for (let col = 0; col < COLS; col++) {
        rowNodes.push(createNode(col, row));
      }
      nodes.push(rowNodes);
    }
    // *** ADD WALLS ***
    WALLS.forEach(wall => {
      const col = wall[0];
      const row = wall[1];
      nodes[row][col] = { ...nodes[row][col], isWall: true };
    });
    return nodes;
  };

  const updateNodes = nodes => {
    const newNodes = [];
    // *** CREATE NODES ***
    for (let row = 0; row < ROWS; row++) {
      const rowNodes = [];
      for (let col = 0; col < COLS; col++) {
        // *** "Restart" some nodes ***
        const currentNode = nodes[row][col];
        if (currentNode.isStart) currentNode.isStart = false;
        if (row === nodeStartRow && col === nodeStartCol)
          currentNode.isStart = true;
        rowNodes.push(currentNode);
      }
      newNodes.push(rowNodes);
    }
    return newNodes;
  };

  // Put a goal in col and row if the node isn't a wall o start
  const handleNodeClick = (col, row) => {
    const { isWall, isStart, isFinish} = nodes[row][col];
    if (isWall || isStart || isFinish || isRunning) return;
    isRunning = true;
    // Add finish node
    const newNodes = createNodes();
    newNodes[row][col] = { ...newNodes[row][col], isFinish: true };
    // Remove previous finish node if exists and it's diferent to current finish node
    if (
      nodeFinishRow !== null &&
      nodeFinishCol !== null &&
      (nodeFinishRow !== row || nodeFinishCol !== col)
    )
      newNodes[nodeFinishRow][nodeFinishCol] = {
        ...newNodes[nodeFinishRow][nodeFinishCol],
        isFinish: false
      };
    resetTextNodeClass();
    setNodeFinishCol(col);
    setNodeFinishRow(row);
    setNodes(newNodes);
    visualize(newNodes, col, row);
  };

  const resetTextNodeClass = () => {
    const textNodes = document.querySelectorAll(".node__text");
    for (const textNode of textNodes) {
      textNode.className = "node__text--hide";
    }
  };

  const animatePlayerRoute = nodeRoute => {
    for (let i = 0; i < nodeRoute.length; i++) {
      // eslint-disable-next-line no-loop-func
      setTimeout(() => {
        const node = nodeRoute[i];
        setNodeStartCol(node.col);
        setNodeStartRow(node.row);
        // Remove node-start class to previous start node
        document.getElementById(
          `node-maze-${node.row}-${node.col}`
        ).className = !node.isFinish
          ? "node__maze node__maze--start"
          : "node__maze node__maze--finish node__maze--start";
        if (node.isFinish) isRunning = false;
      }, 100 * i);
    }
  };

  const animateShortestRoute = nodeRoute => {
    for (let i = 0; i <= nodeRoute.length; i++) {
      if (i === nodeRoute.length) {
        setTimeout(() => {
          animatePlayerRoute(nodeRoute);
        }, 100 * i);
        return;
      }
      setTimeout(() => {
        const node = nodeRoute[i];
        document.getElementById(
          `node-maze-${node.row}-${node.col}`
        ).className = node.isStart
          ? "node__maze node__maze--start"
          : node.isFinish
          ? "node__maze node__maze--finish"
          : "node__maze node__maze--shortest";
      }, 80 * i);
    }
  };

  const animateMaze = (nodesVisited, nodesRoute) => {
    for (let i = 0; i <= nodesVisited.length; i++) {
      if (i === nodesVisited.length) {
        setTimeout(() => {
          animateShortestRoute(nodesRoute);
        }, 80 * i);
        return;
      }
      setTimeout(() => {
        const node = nodesVisited[i];
        const currentNode = document.getElementById(
          `node-maze-${node.row}-${node.col}`
        );
        const currentNodeChildren = currentNode.lastChild;
        currentNodeChildren.className = "node__text";
      }, 70 * i);
    }
  };

  const visualize = (nodes, finishCol, finishRow) => {
    const visitedNodes = searchRoutes(nodes, finishCol, finishRow);
    const route = searchShortRoute(nodes, nodeStartCol, nodeStartRow);
    setTimeout(() => {
      animateMaze(visitedNodes, route);
    }, 300);
  };

  const searchRoutes = (nodes, finishCol, finishRow) => {
    const visitedNodes = [];
    let distance = 0;
    nodes[finishRow][finishCol] = {
      ...nodes[finishRow][finishCol],
      isVisited: true,
      distance
    };
    visitedNodes.push(nodes[finishRow][finishCol]);
    let startNodeFound = false;
    while (!startNodeFound) {
      const nodesByDistance = getNodesByDistance(distance, nodes);
      for (const nodeByDistance of nodesByDistance) {
        const condition = node => !node.isWall && !node.isVisited;
        const unvisitedNeighbors = getNeighbors(
          nodeByDistance,
          nodes,
          condition
        );
        for (const neighbor of unvisitedNeighbors) {
          const { col, row } = neighbor;
          nodes[row][col] = {
            ...nodes[row][col],
            isVisited: true,
            distance: distance + 1
          };
          visitedNodes.push(nodes[row][col]);
          if (nodes[row][col].isStart) startNodeFound = true;
        }
      }
      distance++;
    }
    return visitedNodes;
  };

  const searchShortRoute = (nodes, startCol, startRow) => {
    const startNode = nodes[startRow][startCol];
    const route = [startNode];
    let finishNodeFound = false;
    let currentNode = startNode;
    const condition = node => !node.isWall;
    while (!finishNodeFound) {
      const nodesNeighbors = getNeighbors(currentNode, nodes, condition);
      const nextNodeToVisit = getNearNode(nodesNeighbors);
      route.push(nextNodeToVisit);
      currentNode = nextNodeToVisit;
      if (nextNodeToVisit.isFinish) finishNodeFound = true;
    }
    return route;
  };

  const getNearNode = nodes => {
    const orderNodes = nodes.slice().sort((a, b) => a.distance - b.distance);
    return orderNodes[0];
  };

  // *** NODES STATE ***
  const [nodes, setNodes] = useState(createNodes());

  useEffect(() => {
    setNodes(updateNodes(nodes));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeStartCol, nodeStartRow]);

  return (
    <main className="maze" id="maze">
      <p className="maze__message">
        Click to add a goal
        <span
          style={{ marginLeft: 10 }}
          className="node__maze node__maze--finish"
        ></span>
      </p>
      <section className="maze__grid">
        {nodes.map((row, rowIdx) => {
          return (
            <div className="node__row" key={`row-${rowIdx}`}>
              {row.map((node, nodeIdx) => {
                return (
                  <Node
                    key={`node-${rowIdx}-${nodeIdx}`}
                    node={node}
                    onClick={(col, row) => {
                      handleNodeClick(col, row);
                    }}
                  />
                );
              })}
            </div>
          );
        })}
      </section>
    </main>
  );
};

function getNodesByDistance(distance, nodes) {
  const nodesByDistance = [];
  nodes.forEach(row => {
    nodesByDistance.push(...row.filter(node => node.distance === distance));
  });
  return nodesByDistance;
}

const getNeighbors = (node, nodes, condition) => {
  const neighbors = [];
  const { col, row } = node;
  if (row - 1 >= 0) neighbors.push(nodes[row - 1][col]);
  if (col + 1 < nodes[row].length) neighbors.push(nodes[row][col + 1]);
  if (row + 1 < nodes.length) neighbors.push(nodes[row + 1][col]);
  if (col - 1 >= 0) neighbors.push(nodes[row][col - 1]);
  return neighbors.filter(node => condition(node));
};

export default Maze;
