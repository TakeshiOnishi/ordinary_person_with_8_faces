import Head from "next/head";
import React from "react";
import Board from "../components/Board"
import Stopwatch from "../components/Timer"

import { Box, style, styled } from "@mui/system";
import { Grid } from "@mui/material";

const TopWrappaer = styled(Box)({
  width: '100vw',
  height: '100vh',
  // display:'flex',
  // justifyContent: 'center',
  // alignItems: 'center;',
})

const Home:React.VFC = () => {
  return (
      <TopWrappaer>
        {/* <Grid container spacing={2}>
          <Grid item xs={12}>
          </Grid>
          <Grid item xs={12}>
          </Grid>
          <Grid item xs={12} justifyContent={'center'} alignItems={'center'}>
          </Grid>
        </Grid> */}
            <Head>
              <title>普通人8面相ゲーム</title>
            </Head>
            <Stopwatch />
            <Board />
      </TopWrappaer>
  )
};

export default Home;
