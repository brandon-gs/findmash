import React, { useState, useEffect } from "react";
import "./Modal.css";

export default function Modal() {
  const [show, setShow] = useState(true);

  /** This useEffect allow close the modal when key esc or enter is pressed */
  useEffect(() => {
    const detectKeyPressed = () => {
      const KEYS_TO_CLOSE = ["Escape", "Enter"];
      window.onkeydown = (event) => {
        const someKeyPressed = KEYS_TO_CLOSE.includes(event.key);
        if (someKeyPressed) {
          handleClose();
        }
      };
    };
    detectKeyPressed();
  }, []);

  const handleClose = () => {
    setShow(false);
  };

  return (
    show && (
      <section className="modal">
        <div className="modal-content">
          <div className="modal-content-head">
            <h1>Welcome to Pathfinding Visualizer!</h1>
          </div>
          <div className="modal-content-body">
            <p className="modal-content-text">
              This short tutorial will walk you through the use of this
              application.
            </p>
            <iframe
              title="pathfinding tutorial"
              src="https://www.youtube.com/embed/vZAYA2lzNQg"
              width="100%"
              height="340"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
          <div className="modal-content-footer">
            <button className="modal-content-button" onClick={handleClose}>
              Finish tutorial
            </button>
          </div>
        </div>
      </section>
    )
  );
}
