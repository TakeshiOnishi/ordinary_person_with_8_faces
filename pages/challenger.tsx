import Head from "next/head";
import React from "react";
import { css } from 'linaria';
import dynamic from 'next/dynamic'
const Board = dynamic(import('../components/Board'), { ssr: false });

const Challenger:React.VFC = () => {

  const wrapperCSS = css`
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  `;

  return (
    <div className={wrapperCSS}>
      <Head>
        <title>【挑戦者】普通人8面相ゲーム</title>
      </Head>
      <Board />
    </div>
  )
};

export default Challenger;
