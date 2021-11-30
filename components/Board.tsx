import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import { WithFaceExpressions, WithFaceDetection } from "face-api.js";
import { css } from "linaria";
import Cell from "./Cell";

const Board: React.VFC = () => {
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
    grid-template-rows: 30% 30% 30%;
    grid-template-columns: 30% 30% 30%;
    width: 80%;
    height: 80%;
  `;

  const expressions: Array<{
    index: number;
    display: string;
    label: string;
    threshold: number;
  }> = [
    {
      index: 0,
      display: "ハッピー！😄",
      label: "happy",
      threshold: 0.999,
    },
    {
      index: 1,
      display: "標準😐",
      label: "neutral",
      threshold: 0.9,
    },
    {
      index: 2,
      display: "かなしみ😭",
      label: "sad",
      threshold: 0.9,
    },
    {
      index: 3,
      display: "おこ😠",
      label: "angry",
      threshold: 0.8,
    },
    {
      index: 4,
      display: "中心！",
      label: "CENTER",
      threshold: 0.999,
    },
    {
      index: 5,
      display: "恐れ🤭 手も使おう！",
      label: "fearful",
      threshold: 0.6,
    },
    {
      index: 6,
      display: "渋顔😖",
      label: "disgusted",
      threshold: 0.2,
    },
    {
      index: 7,
      display: "驚き😲",
      label: "surprised",
      threshold: 0.999,
    },
    {
      index: 8,
      display: "激おこ🤬",
      label: "big_angry",
      threshold: 0.999,
    },
  ];

  const faceVideoElm = useRef<HTMLVideoElement>(null);
  const faceCanvasElm = useRef<HTMLCanvasElement>(null);
  const cellRefs = useRef<any[]>([]);

  const detectionStart = async () :Promise<ReturnType<typeof setTimeout>> => {
    if (
      faceVideoElm.current.paused ||
      faceVideoElm.current.ended ||
      !faceapi.nets.ssdMobilenetv1
    ) {
      return setTimeout(() => detectionStart(), 1000);
    }

    const expressionResult:WithFaceExpressions<WithFaceDetection<{}>> = await faceapi
      .detectSingleFace(faceVideoElm.current)
      .withFaceExpressions();

    if (expressionResult) {
      const dims = faceapi.matchDimensions(
        faceCanvasElm.current,
        faceVideoElm.current,
        true
      );
      faceapi.draw.drawDetections(
        faceCanvasElm.current,
        faceapi.resizeResults(expressionResult, dims)
      );
      faceapi.draw.drawFaceExpressions(
        faceCanvasElm.current,
        faceapi.resizeResults(expressionResult, dims)
      );
      expressionThresholdCheck(expressionResult);
    }

    setTimeout(() => detectionStart(), 200);
  }

  const expressionThresholdCheck = (expressionResult:WithFaceExpressions<WithFaceDetection<{}>>): void => {
    expressions.forEach((expression) => {
      if (
        expressionResult["expressions"][expression["label"]] >=
        expression["threshold"]
      ) {
        // モデルラベル以外の例外判定
        if (expressionResult["expressions"]["angry"] >= 0.9999) {
          const found = expressions.find((expression) => expression["label"] == 'big_angry');
          drawCaptureFace(found['index']);
        }
        drawCaptureFace(expression["index"]);
      }
    });
  };

  const drawCaptureFace = (squareIndex:number) => {
    const captureTmpCanvas = document.createElement("canvas");
    const captureWidth = faceVideoElm.current.clientWidth;
    const captureHeight = faceVideoElm.current.clientHeight;

    captureTmpCanvas.width = captureWidth;
    captureTmpCanvas.height = captureHeight;
    captureTmpCanvas
      .getContext("2d")
      .drawImage(faceVideoElm.current, 0, 0, captureWidth, captureHeight);
    cellRefs.current[squareIndex].current.updateSetImage(
      captureTmpCanvas.toDataURL()
    );
  };

  const initCellRefs = (): void => {
    expressions.forEach((expressions) => {
      cellRefs.current[expressions["index"]] = React.createRef();
    });
  };

  const startCam = async () :Promise<void> => {
    await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
    await faceapi.nets.faceExpressionNet.loadFromUri("/models");
    await navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: false,
      })
      .then((stream) => {
        faceVideoElm.current.srcObject = stream;
        faceVideoElm.current.play();
      })
      .catch((errorMsg) => {
        console.log(errorMsg);
      });
  };

  useEffect(() => {
    startCam();
  }, []);

  initCellRefs();

  return (
    <>
      <div className={boardWrapperCSS}>
        {expressions.map((expression) => {
          if (expression["label"] == "CENTER") {
            return (
              <div key={expression["label"]} className={faceWrapperCSS}>
                <video
                  ref={faceVideoElm}
                  onLoadedMetadata={detectionStart}
                  className={faceVideoCSS}
                />
                <canvas ref={faceCanvasElm} className={faceCanvasCSS} />
              </div>
            );
          } else {
            return (
              <Cell
                key={expression["label"]}
                expression={expression["display"]}
                ref={cellRefs.current[expression["index"]]}
              />
            );
          }
        })}
      </div>
    </>
  );
};

export default Board;