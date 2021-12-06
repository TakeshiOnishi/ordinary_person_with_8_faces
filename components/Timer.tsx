import { Button } from "@mui/material";
import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect, useCallback } from "react";
import useStopwatch from '../hooks/useStopwatch';


const Stopwatch: React.VFC = () => {

  const {
    seconds100,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({ autoStart: false, offsetTimestamp: 0 });

  const hoge = (valu) =>{
    if (valu.toString().length == 2){
      return valu.toString()
    } else {
      return '0' + valu.toString()
    }
  }

  return (
    <div style={{textAlign: 'center'}}>
      <h1>経過時間</h1>
      <div style={{fontSize: '100px'}}>
        <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>:<span>{hoge(seconds100)}</span>
      </div>
      <p>{isRunning ? 'Running' : 'Not running'}</p>
      <button onClick={start}>Start</button>
      <button onClick={pause}>Pause</button>
      {/* <button onClick={reset}>Reset</button> */}
    </div>
  );
}

export default Stopwatch;