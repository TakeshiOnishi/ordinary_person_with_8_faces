import React, { useState, useEffect } from "react";
import { css } from 'linaria';
import AgoraRTC from 'agora-rtc-sdk-ng'
import { Bars } from 'react-loading-icons'

const loadingCSS = css`
  width: 100vw;
  height: 100vh;
  text-align: center;
  > span {
   display: block;
   color: #06bcee;
   font-size: 1.3rem;
  }
`;

const viewerCSS = css`
  display: grid;
  grid-template-rows: 50% 50%;
  grid-template-columns: 50% 50%;
  width: 100vw;
  height: 100vh;
`;

const shareWrapCSS = css`
  object-fit: fill;
  width: 100%;
  height: 100%;
  > * {
   object-fit: fill !important;
  }
`;


const Viewer:React.VFC = () => {
  const [remoteUsers, setRemoteUsers] = useState([])

  let agoraClient;
  const options = {
    appid: process.env.NEXT_PUBLIC_AGORA_APP_ID,
    channel: process.env.NEXT_PUBLIC_AGORA_CHANNEL_NAME,
    uid: null,
    token: process.env.NEXT_PUBLIC_AGORA_TEMP_TOKEN
  };

  const join = async () => {
    agoraClient.on("user-published", handleUserPublished);
    agoraClient.on("user-unpublished", handleUserUnpublished);
    [ options.uid ] = await Promise.all([
      agoraClient.join(options.appid, options.channel, options.token || null)
    ]);
  }

  const handleUserPublished = (user, mediaType) => {
    setRemoteUsers((remoteUsers) => [...remoteUsers, user.uid]);
    subscribe(user, mediaType);
  }

  const subscribe = async (user, mediaType) => {
    await agoraClient.subscribe(user, mediaType);
    if (mediaType === 'video') {
      user.videoTrack.play(`player-${user.uid}`);
    }
  }

  const handleUserUnpublished = (user) => {
    setRemoteUsers((remoteUsers) => remoteUsers.filter(remoteUser => remoteUser !== user.uid))
  }


  useEffect(() => {
    agoraClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    join();
  }, []);

  return (
    <div className={viewerCSS}>
      {remoteUsers.length == 0 && <> <p className={loadingCSS}><Bars fill="#06bcee" stroke="#06bcee" width="100" height="100" /> <span>... Loading ...</span></p> </> }
      {remoteUsers.map((remoteUser) => {
        return <div id={`player-${remoteUser}`} key={remoteUser} className={shareWrapCSS} />
      })}
    </div>
  )
}

export default Viewer;
