import Head from "next/head";
import React from "react";
import Board from "../components/Board"
import { Box, styled } from "@mui/system";

const TopWrappaer = styled(Box)({
  width: '100vw',
  height: '100vh',
  display:'flex',
  justifyContent: 'center',
  alignItems: 'center;',
})

const Home:React.VFC = () => {
  return (
    <TopWrappaer>
      <Head>
        <title>普通人8面相ゲーム</title>
      </Head>
      <Board />
    </TopWrappaer>
  )
};

export default Home;
