import React, { useState } from "react";
import "./Modal.css";

export default function Modal() {
  const [show, setShow] = useState(true);

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
            <video controls className="modal-video">
              <source src="tutorial.mp4" height="450" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
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
