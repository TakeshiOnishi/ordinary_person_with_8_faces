import React, { useEffect, forwardRef } from "react";
import { css } from 'linaria';

const Square = ({expression}, ref) => {

  const squareCSS = css`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #CCC;
  `;

  const annotationCSS = css`
    position: absolute;
    top: 0px;
    font-weight: bold;
  `;

  useEffect(() => {
  }, [])

  return (
    <div className={squareCSS} ref={ref}>
      <p className={annotationCSS}>{expression}</p>
      <img src="" alt="" />
    </div>
  )
}

export default forwardRef(Square);
