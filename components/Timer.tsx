import { Button } from "@mui/material";
import { styled } from "@mui/system";
import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect, useCallback } from "react";
import useStopwatch from '../hooks/useStopwatch';
import { zeroPadding } from "../uitl/decorator";


const H1 = styled('h1')({
  marginBottom: '0'
})

interface Props {
  minutes: number;
  seconds: number;
  seconds100: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

const Stopwatch: React.VFC<Props> = (props) => {
  return (
    <div style={{textAlign: 'center'}}>
      <H1>経過時間</H1>
      <div style={{fontSize: '90px', lineHeight: '1em'}}>
        <span>{zeroPadding(props.minutes)}</span>:<span>{zeroPadding(props.seconds)}</span>:<span>{zeroPadding(props.seconds100)}</span>
      </div>
      <p style={{marginBottom: '0', marginTop: '0'}}>{props.isRunning ? 'Running' : 'Not running'}</p>
      <button onClick={props.start}>Start</button>
      <button onClick={props.pause}>Pause</button>
      <button onClick={props.reset}>Reset</button>
    </div>
  );
}

export default Stopwatch;