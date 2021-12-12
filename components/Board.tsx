import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { WithFaceExpressions, WithFaceDetection } from "face-api.js";
import { css } from "linaria";
import Cell from "./Cell";
import useStopwatch from "../lib/hooks/useStopwatch";
import Stopwatch from "./Timer";

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
    grid-template-rows: 33% 33% 33%;
    grid-template-columns: 33% 33% 33%;
    height: 90vh;
    width: 90vw;
    margin-left: auto;
    margin-right: auto;
  `;

  const startRibbon = css`
    background: #696969;
    z-index: 1;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    margin: auto;
    height: 200px;
    line-height: 200px;
    text-align: center;
    opacity: 0.4
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
      threshold: 0.98,
    },
  ];

  const faceVideoElm = useRef<HTMLVideoElement>(null);
  const faceCanvasElm = useRef<HTMLCanvasElement>(null);
  const cellRefs = useRef<any[]>([]);
  const [isShowRibbon, setIsShowRibbon] = useState<boolean>(false);
  const gameStart = useRef(false);
  const [results, setResults] = useState({
    happy: false,
    neutral: false,
    sad: false,
    angry: false,
    fearful: false,
    surprised: false,
    disgusted: false,
    big_angry: false,
  });

  const {
    seconds100,
    seconds,
    minutes,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({ autoStart: false, offsetTimestamp: 500 });

  const isBingo = () :boolean => {
    return !Object.values(results).includes(false)
  };

  const checkResults = () :void => {
    if (isBingo()) {
      pausePlaying()
    }
  };

  const detectionStart = async () :Promise<ReturnType<typeof setTimeout>> => {
    if (
          faceVideoElm.current.paused ||
          faceVideoElm.current.ended ||
          !faceapi.nets.ssdMobilenetv1) {

      return setTimeout(() => detectionStart(), 500);
    }

    const expressionResult:WithFaceExpressions<WithFaceDetection<{}>> = await faceapi
      .detectSingleFace(faceVideoElm.current)
      .withFaceExpressions();

    if (gameStart.current && expressionResult) {
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

    setTimeout(() => detectionStart(), 1000);
  }

  const expressionThresholdCheck = (expressionResult:WithFaceExpressions<WithFaceDetection<{}>>): void => {
    expressions.forEach((expression) => {
      if (
        expressionResult["expressions"][expression["label"]] >=
        expression["threshold"]
      ) {
        // モデルラベル以外の例外判定
        if (expressionResult["expressions"]["angry"] >= 0.999) {
          const found = expressions.find((expression) => expression["label"] == 'big_angry');
          drawCaptureFace(found['index']);
          setResults(prev => Object.assign(prev, { big_angry: true }));
        } else {
          drawCaptureFace(expression["index"]);
          setResults(prev => Object.assign(prev, {[expression.label]: true}));

        }
      }
      checkResults();
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

  const sleep = (msec:number) => new Promise(resolve => setTimeout(resolve, msec));

  const startPlaying = async () :Promise<void> => {
    setIsShowRibbon(true);
    (async () => {
      await sleep(2000);
      setIsShowRibbon(false)
      start();
    })();
    gameStart.current = true;
  }

  const pausePlaying = () :void => {
    pause();
    faceVideoElm.current.pause();
  }

  useEffect(() => {
    initCellRefs();
    startCam();
  }, []);

  return (
    <>
      <div className={startRibbon} style={{ visibility: isShowRibbon? 'visible':'hidden'}}>
        <span style={{fontSize: '80px', color: 'white'}}>ready...</span>
      </div>
      <Stopwatch minutes={minutes} seconds={seconds} seconds100={seconds100} isRunning={isRunning} start={startPlaying} pause={pausePlaying} reset={reset} />
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
