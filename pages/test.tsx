import Head from "next/head";
import React from "react";
import dynamic from 'next/dynamic'
const Test = dynamic(import('../components/Test'), { ssr: false });

const TestPage:React.VFC = () => {

  return (
    <>
      <Head>
        <title>動作テストページ</title>
      </Head>
      <Test />
    </>
  )
};

export default TestPage;
