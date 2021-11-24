import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import { css } from 'linaria';
import Square from "./Square"

export default function Board() {

  const faceWrapperCSS = css`
    position: relative;
  `;
  const faceVideoCSS = css`
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
  `;
  const faceCanvasCSS = css`
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
  `;

  const boardWrapperCSS = css`
    display: grid;
    grid-template-rows: 300px 300px 300px;
    grid-template-columns: 300px 300px 300px;
    width: 80%;
    height: 80%;
  `;

  const expressions = [
    {
      "index": 0,
      "display": 'ハッピー！',
      "label": 'happy',
      "threshold": 0.999
    },
    {
      "index": 1,
      "display": '標準',
      "label": 'neutral',
      "threshold": 0.999
    },
    {
      "index": 2,
      "display": 'かなしみ',
      "label": 'sad',
      "threshold": 0.9
    },
    {
      "index": 3,
      "display": '怒り！',
      "label": 'angry',
      "threshold": 0.999
    },
    {
      "index": 4,
      "display": '中心！',
      "label": 'CENTER',
      "threshold": 0.999
    },
    {
      "index": 5,
      "display": '恐れ...😨 手も使おう！',
      "label": 'fearful',
      "threshold": 0.6
    },
    {
      "index": 6,
      "display": '苦いもの食べたときのような...',
      "label": 'disgusted',
      "threshold": 0.1
    },
    {
      "index": 7,
      "display": '驚き@',
      "label": 'surprised',
      "threshold": 0.999
    },
    {
      "index": 8,
      "display": '阿修羅',
      "label": 'big_angry',
      "threshold": 0.999
    },
  ];


  const faceVideoElm = useRef(null)
  const faceCanvasElm = useRef(null)

  async function onPlay() {
    
    if(faceVideoElm.current.paused || faceVideoElm.current.ended || !faceapi.nets.ssdMobilenetv1) {
      return setTimeout(() => onPlay(), 1000);
    }

    const result = await faceapi.detectSingleFace(faceVideoElm.current).withFaceExpressions()

    if (result) {
      const dims = faceapi.matchDimensions(faceCanvasElm.current, faceVideoElm.current, true)
      const minProbability = 0.3
      faceapi.draw.drawDetections(faceCanvasElm.current, faceapi.resizeResults(result, dims))
      faceapi.draw.drawFaceExpressions(faceCanvasElm.current, faceapi.resizeResults(result, dims), minProbability)
      expressions.forEach(expression => {
        if(result['expressions'][expression['label']] >= expression['threshold']){
          if(result['expressions']['angry'] >= 0.9999){
            drawCaptureFace(expression, 8) //magicどうにかする
          }
          drawCaptureFace(expression, expression['index'])
        }
      })
    }

    setTimeout(() => onPlay(), 100)
  }

  const drawCaptureFace = (expression, squareIndex) => {
    const captureTmpCanvas = document.createElement('canvas');
    const captureWidth = faceVideoElm.current.clientWidth
    const captureHeight = faceVideoElm.current.clientHeight

    captureTmpCanvas.width = captureWidth;
    captureTmpCanvas.height = captureHeight;
    captureTmpCanvas.getContext('2d').drawImage(faceVideoElm.current, 0, 0, captureWidth, captureHeight);
    expressionRefs.current[squareIndex].current.querySelector('img').src = captureTmpCanvas.toDataURL();
  }

  async function run() {
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
    await faceapi.nets.faceExpressionNet.loadFromUri('/models')
    await navigator.mediaDevices.getUserMedia({ 
      video: true,
      autdio: false,
    }).then(stream => {
      faceVideoElm.current.srcObject = stream
      faceVideoElm.current.play()
    }).catch(errorMsg => {
      console.log(errorMsg)
    })
  }

  const expressionRefs = useRef([]);
    expressions.forEach((expressions) => {
      expressionRefs.current[expressions['index']] = React.createRef();
  });
  
  useEffect(() => {
    run()
  }, [])

  return (
    <>
      <div className={boardWrapperCSS}>
        {expressions.map(expression => {
          if(expression['label'] == 'CENTER'){
            return (
              <div key={expression['label']} className={faceWrapperCSS}>
                <video ref={faceVideoElm} onLoadedMetadata={onPlay} className={faceVideoCSS} />
                <canvas ref={faceCanvasElm} className={faceCanvasCSS} />
              </div>
            )
          }else{
            return <Square key={expression['label']} expression={expression['display']} ref={expressionRefs.current[expression['index']]} />
          }
        })}
      </div>
    </>
  )
}
