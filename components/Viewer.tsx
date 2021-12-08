import React, { useState, useEffect } from "react";
import { css } from 'linaria';
import AgoraRTC from 'agora-rtc-sdk-ng'

const wrapperCSS = css`
  display: grid;
  grid-template-rows: 100% 50%;
  grid-template-columns: 50% 50%;
  width: 100vw;
  height: 100vh;
`;

const ShareContentCSS = css`
  object-fit: fill;
  width: 100%;
  height: 100%;
  > * {
   object-fit: fill !important;
  }
`;

const Viewer:React.VFC = () => {
  const [remoteUsers, setRemoteUsers] = useState([])

  let client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  const options = {
    appid: process.env.NEXT_PUBLIC_AGORA_APP_ID,
    channel: process.env.NEXT_PUBLIC_AGORA_CHANNEL_NAME,
    uid: null,
    token: process.env.NEXT_PUBLIC_AGORA_TEMP_TOKEN
  };


  async function join() {

    // add event listener to play remote tracks when remote user publishs.
    client.on("user-published", handleUserPublished);

    // join a channel and create local tracks, we can use Promise.all to run them concurrently
    [ options.uid ] = await Promise.all([
      // join the channel
      client.join(options.appid, options.channel, options.token || null)
    ]);
  }

  async function subscribe(user, mediaType) {
    const uid = user.uid;
    // subscribe to a remote user
    await client.subscribe(user, mediaType);
    console.log("subscribe success");
    if (mediaType === 'video') {
      user.videoTrack.play(`player-${uid}`);
    }
  }

  function handleUserPublished(user, mediaType) {
    const id = user.uid;
    setRemoteUsers([...remoteUsers, id]);
    subscribe(user, mediaType);
  }

  useEffect(() => {
    join();
  }, []);

  return (
    <div className={wrapperCSS}>
      {remoteUsers.map((remoteUser, i) => {
        return (
          <>
            <div id={`player-${remoteUser}`} key={i} className={ShareContentCSS}></div>
          </>
        );
      })}
    </div>
  )
}

export default Viewer;
