import React, { useState } from "react";
import { zeroPadding } from "../lib/Decorator";
import { css } from "linaria";

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
  const [disabled, setDisabled] = useState<boolean>(false);
  const handleOnClick = () => {
    props.start()
    setDisabled(true)
  }

  return (
    <div style={{textAlign: 'center', marginLeft: 'auto', marginRight: 'auto'}}>
      <div style={{display: 'inline-flex'}}>
        <button onClick={handleOnClick} style={{marginTop: '10px', marginBottom: '10px', marginRight: '20px'}} disabled={disabled}>ゲーム開始</button>
        <div className={timer}>
          <span className={monospace}>{zeroPadding(props.minutes)}</span>:<span className={monospace}>{zeroPadding(props.seconds-1)}</span>:<span className={monospace}>{zeroPadding(props.seconds100)}</span>
        </div>
      </div>
    </div>
  );
}

export default Stopwatch;
