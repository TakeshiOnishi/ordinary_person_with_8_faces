import Head from "next/head";
import React from "react";
import { css } from 'linaria';
import Board from "../components/Board"

export default function Home() {

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
        <title>阿修羅ゲーム</title>
      </Head>
      <Board />
    </div>
  )
}
