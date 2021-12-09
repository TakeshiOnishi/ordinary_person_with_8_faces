import Head from "next/head";
import React from "react";
import { css } from 'linaria';
import dynamic from 'next/dynamic'
const Board = dynamic(import('../components/Board'), { ssr: false });

const Challenger:React.VFC = () => {

  const wrapperCSS = css`
    max-width: 100vw;
    max-height: 100vh;
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
