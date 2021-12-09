import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect, useCallback } from "react";
import { zeroPadding } from "../lib/Decorator";
import { css } from "linaria";

const h1 = css`
  marginBottom: 0;
`;

const timer = css`
  font-size: 60px;
  line-height: 1em;
`;

const monospace = css`
  font-family:monospace;
`

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
    <div style={{textAlign: 'center', marginLeft: 'auto', marginRight: 'auto'}}>
      <div style={{display: 'inline-flex'}}>
        <button onClick={props.start} style={{marginTop: '10px', marginBottom: '10px', marginRight: '20px'}}>ゲーム開始</button>
        <div className={timer}>
          <span className={monospace}>{zeroPadding(props.minutes)}</span>:<span className={monospace}>{zeroPadding(props.seconds-2)}</span>:<span className={monospace}>{zeroPadding(props.seconds100)}</span>
        </div>
      </div>
    </div>
  );
}

export default Stopwatch;