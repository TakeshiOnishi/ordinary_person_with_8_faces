import React, { useRef, useImperativeHandle, forwardRef } from "react";
import { css } from 'linaria';


type updateSetImageHandle = {
  updateSetImage: (imageData:any) => void
}

type Props = {
  expression: string
};

const Cell:React.ForwardRefRenderFunction<updateSetImageHandle, Props> = ({expression}, ref) => {

  const imgRef = useRef<HTMLImageElement>(null);

  const squareCSS = css`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #CCC;
    object-fit: cover;
  `;

  const annotationCSS = css`
    position: absolute;
    top: 0px;
    font-weight: bold;
  `;

  const faceImageCSS = css`
    width: 100%;
    height: 100%;
  `;

  useImperativeHandle(ref, () => ({
    updateSetImage:(imageData: any) => {
      imgRef.current.src = imageData;
    }
  }));

  return (
    <div className={squareCSS}>
      <p className={annotationCSS}>{expression}</p>
      <img className={faceImageCSS}  ref={imgRef} />
    </div>
  )
}

export default forwardRef(Cell);
