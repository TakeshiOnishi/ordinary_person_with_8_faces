import { Button } from "@mui/material";
import { styled } from "@mui/system";
import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect, useCallback } from "react";
import useStopwatch from '../hooks/useStopwatch';
import { zeroPadding } from "../uitl/decorator";


const H1 = styled('h1')({
  marginBottom: '0'
})

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
      <H1>経過時間</H1>
      <div style={{fontSize: '90px', lineHeight: '1em'}}>
        <span>{zeroPadding(minutes)}</span>:<span>{zeroPadding(seconds)}</span>:<span>{zeroPadding(seconds100)}</span>
      </div>
      <p style={{marginBottom: '0', marginTop: '0'}}>{isRunning ? 'Running' : 'Not running'}</p>
      <button onClick={start}>Start</button>
      <button onClick={pause}>Pause</button>
      {/* <button onClick={reset}>Reset</button> */}
    </div>
  );
}

export default Stopwatch;