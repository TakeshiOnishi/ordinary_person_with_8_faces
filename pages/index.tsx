import Head from "next/head";
import React from "react";
import dynamic from 'next/dynamic'
const Board = dynamic(import('../components/Board'), { ssr: false });

const Other:React.VFC = () => {

  return (
    <>
      <Head>
        <title>普通人8面相ゲーム</title>
      </Head>
      <Board />
    </>
  )
};

export default Other;
