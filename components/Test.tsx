import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import { WithFaceExpressions, WithFaceDetection } from "face-api.js";
import { css } from "linaria";
import Cell from "./Cell";
import AgoraRTC from 'agora-rtc-sdk-ng'

const Test: React.VFC = () => {
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
    width: 100vw;
    height: 100vh;
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
    }

    setTimeout(() => detectionStart(), 1000);
  }

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
    join();
  };

  useEffect(() => {
    startCam();
  }, []);

  let client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  let localTracks = {
    videoTrack: null
  };
  const options = {
    appid: process.env.NEXT_PUBLIC_AGORA_APP_ID,
    channel: process.env.NEXT_PUBLIC_AGORA_CHANNEL_NAME,
    uid: null,
    token: process.env.NEXT_PUBLIC_AGORA_TEMP_TOKEN
  };

  const join = async () => {
    [ options.uid, localTracks.videoTrack ] = await Promise.all([
      client.join(options.appid, options.channel, options.token || null),
      AgoraRTC.createScreenVideoTrack({}, "disable")
    ]);
    localTracks.videoTrack.play("local-player");
    await client.publish(Object.values(localTracks));
  }

  useEffect(() => {
  }, []);

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
                ref={null}
              />
            );
          }
        })}
      </div>
    </>
  );
};

export default Test;
