import Head from "next/head";
import React from "react";
import AgoraRTC from 'agora-rtc-sdk-ng'
import dynamic from 'next/dynamic'
const Viewer = dynamic(import('../components/Viewer'), { ssr: false });

const Other:React.VFC = () => {

  return (
    <>
      <Head>
        <title>(管理者) 普通人8面相ゲーム</title>
      </Head>
      <Viewer />
    </>
  )
};

export default Other;
