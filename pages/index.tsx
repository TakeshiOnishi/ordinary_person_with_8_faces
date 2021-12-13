import Head from "next/head";
import React from "react";
import dynamic from 'next/dynamic'
const Board = dynamic(import('../components/Board'), { ssr: false });
import GA from '../components/GA';

const Other:React.VFC = () => {

  return (
    <>
      <Head>
        <title>普通人8面相ゲーム</title>
      </Head>
      <GA />
      <Board />
    </>
  )
};

export default Other;
