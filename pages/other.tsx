import Head from "next/head";
import React from "react";
import AgoraRTC from 'agora-rtc-sdk-ng'
import dynamic from 'next/dynamic'
const Viewer = dynamic(import('../components/Viewer'), { ssr: false });

const Other:React.VFC = () => {

  return (
   <Viewer />
  )
};

export default Other;
