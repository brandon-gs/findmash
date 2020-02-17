import React, { useState, useEffect } from "react";
import ArrayElement from "./ArrayElement/ArrayElement.jsx";
import { createArray, binarySearch } from "../../algorithms/binarySearch";
import { getGridTemplateColumns } from "../../helpers";
import "./BinarySearch.css";

const INITIAL_ARRAY_SIZE =
  Math.floor((document.body.clientWidth - 35) / 35) - 2;
const isNumber = /^\d+$/;

export default () => {
  const handleTargetChange = nextTarget => {
    const onlyNumbers = isNumber.test(nextTarget);
    const isOnRange = onRange(arraySize, nextTarget);
    const error = !onlyNumbers
      ? "The entry must only contain numbers"
      : !isOnRange
      ? "The entry isn't on range"
      : "";
    setError(error);
    setTarget(nextTarget);
  };

  const handleClick = nextTarget => {
    let next = nextTarget;
    if (nextTarget > arraySize) next = arraySize;
    else if (nextTarget < 1) next = 1;
    setTarget(next);
    setError("");
  };

  const visualizeBinarySearch = () => {
    const test = binarySearch(array, target);
    setTimeout(() => {
        for(let i = 0; i < test.length; i++){
            setTimeout(() => {
                document.getElementById(`binary-${i+1}`).style.color = "yellow";
            }, 220 * i);
        }
    }, 300);
  };

  const [arraySize, setArraySize] = useState(INITIAL_ARRAY_SIZE);
  const [array, setArray] = useState(createArray(arraySize));
  const [target, setTarget] = useState(
    Math.floor(Math.random() * arraySize) + 1
  );
  const [error, setError] = useState("");

  window.addEventListener("resize", () => {
    setArraySize(Math.floor((document.body.clientWidth - 35) / 35) - 2);
  });

  useEffect(() => {
    setArray(createArray(arraySize));
    setTarget(Math.floor(Math.random() * arraySize) + 1);
  }, [arraySize]);

  return (
    <section className="binary__section">
      <div className="binary__input">
        <p>Enter a number to search (1 - {arraySize})</p>
        <div className="quantity">
          <input
            type="text"
            value={target}
            onChange={({ target: { value } }) => {
              handleTargetChange(value);
            }}
          ></input>
          <div className="quantity__btns">
            <button
              disabled={!isNumber.test(target)}
              onClick={() => handleClick(Number(target) + 1)}
              className="quantity__btn"
            >
              +
            </button>
            <button
              disabled={!isNumber.test(target)}
              onClick={() => handleClick(Number(target) - 1)}
              className="quantity__btn"
            >
              -
            </button>
          </div>
        </div>
        <p className="binary__error">{error}</p>
      </div>
      <button
        className="binary__btn"
        disabled={error !== ""}
        onClick={() => visualizeBinarySearch()}
      >
        Visualize binary search
      </button>
      <div
        style={{
          gridTemplateColumns: getGridTemplateColumns(arraySize, "35px")
        }}
        className="binary__search"
      >
        {array.map(number => {
          return (
            <ArrayElement
              key={`array-${number}`}
              number={number}
            ></ArrayElement>
          );
        })}
      </div>
    </section>
  );
};

const onRange = (maxRange, nextTarget) => {
  return nextTarget > 0 && nextTarget <= maxRange;
};
