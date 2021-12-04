import React, { useRef, useImperativeHandle, forwardRef } from "react";
import { css } from 'linaria';
import { Box, styled } from '@mui/system';

type updateSetImageHandle = {
  updateSetImage: (imageData:any) => void
}

type Props = {
  expression: string
};


const Annotation = styled('p')({
  position: "absolute",
  top: 0,
  fontWeight: "bold"
});

const FaceImage = styled('img')({
  width: '100%',
  height: '100%',
})

const FaceBox = styled(Box)({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid #CCC',
  objectFit: 'cover',
})


const Cell:React.ForwardRefRenderFunction<updateSetImageHandle, Props> = ({expression}, ref) => {

  const imgRef = useRef<HTMLImageElement>(null);

  useImperativeHandle(ref, () => ({
    updateSetImage:(imageData: any) => {
      imgRef.current.src = imageData;
    }
  }));

  return (
    <FaceBox>
      <Annotation>{expression}</Annotation>
      <FaceImage ref={imgRef}/>
    </FaceBox>
  )
}

export default forwardRef(Cell);
