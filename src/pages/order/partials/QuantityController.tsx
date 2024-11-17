import Button from "components/button/button";
import { IDrug } from "model/drug/response/DrugModelResponse";
import React, { useEffect, useState } from "react";
import "../OrderCreate.scss";

interface QuantityControllerProps {
  callback: any;
  item: IDrug;
}

export default function QuantityController(props: QuantityControllerProps) {
  const { callback, item } = props;
  const [number, setNumber] = useState(0);
  const handlePrev = () => {
    number > 0 ? setNumber(number - 1) : null;
  };
  const handleNext = () => {
    setNumber(number + 1);
  };
  useEffect(() => {
    callback(number, item);
  }, [number]);
  return (
    <div className="quantity-controller">
      <span className="quantity">Số lượng:</span>
      <div className="btn">
        <button type="button" onClick={handlePrev}>
          -
        </button>
        <span className="number-quantity">{number}</span>
        <button type="button" onClick={handleNext}>
          +
        </button>
      </div>
    </div>
  );
}
