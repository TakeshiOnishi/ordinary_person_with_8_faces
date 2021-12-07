import { Button } from "@mui/material";
import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect, useCallback } from "react";
import useStopwatch from '../hooks/useStopwatch';
import { zeroPadding } from "../uitl/decorator";

const Stopwatch: React.VFC = () => {

  const {
    seconds100,
    seconds,
    minutes,
    isRunning,
    start,
    pause,
  } = useStopwatch({ autoStart: false, offsetTimestamp: 0 });

  return (
    <div style={{textAlign: 'center'}}>
      <h1>経過時間</h1>
      <div style={{fontSize: '100px'}}>
        <span>{zeroPadding(minutes)}</span>:<span>{zeroPadding(seconds)}</span>:<span>{zeroPadding(seconds100)}</span>
      </div>
      <p>{isRunning ? 'Running' : 'Not running'}</p>
      <button onClick={start}>Start</button>
      <button onClick={pause}>Pause</button>
      {/* <button onClick={reset}>Reset</button> */}
    </div>
  );
}

export default Stopwatch;