import React, { useState, useEffect } from "react";
import { FaChevronRight } from "react-icons/fa";
import { FiTarget } from 'react-icons/fi';
import "./Alert.css";

export default ({ type = "default" }) => {
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState(null);
  const [color, setColor] = useState(null);

  useEffect(() => {
    if (type === "start") {
      setMessage("Click on a node to add a start node");
      setColor("#3B3B98");
      setIcon(<FaChevronRight />);
    } else if (type === "finish") {
      setMessage("Click on a node to add a target node");
      setColor("#ff3838");
      setIcon(<FiTarget />);
    } else if (type === "wall") {
      setMessage("Press click and hold on the nodes to add a wall");
      setIcon(<div className="node node--wall" />);
    }
    const infoMessageElement = document.getElementById("info--message");
    infoMessageElement.classList.remove("info--animate");
    infoMessageElement.style = "transform: scale(0.3)";
    setTimeout(() => {
      infoMessageElement.classList.add("info--animate");
      infoMessageElement.style = "";
    }, 10);
  }, [type]);

  const extraClassName =
    type === "start"
      ? "info--start"
      : type === "finish"
      ? "info--finish"
      : type === "wall"
      ? "info--wall"
      : "";

  return (
    <div id="info--message" className={`info ${extraClassName}`}>
      {message}
      <div
        style={{
          display: "flex",
          margin: 5,
          color,
          marginRight: 10,
          fontSize: "1.3em"
        }}
      >
        {icon}
      </div>
    </div>
  );
};
