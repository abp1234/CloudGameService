import React, { useEffect, useState, useRef } from "react";
import { RTCPeerConnection, RTCView, mediaDevices } from "react-native-webrtc";

const WebRTCClient = () => {
  const [localStream, setLocalStream] = useState<any>(null);
  const [remoteStream, setRemoteStream] = useState<any>(null);

  const configuration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };

  const peerConnection = useRef<any>(new RTCPeerConnection(configuration)).current;

  useEffect(() => {
    const startMedia = async () => {
      try {
        const stream = await mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setLocalStream(stream);

        // 각 트랙을 peerConnection에 추가
        stream.getTracks().forEach((track: any) => {
          peerConnection.addTrack(track, stream);
        });
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    startMedia();

    // 이벤트 핸들러 설정
    peerConnection.ontrack = (event: any) => {
      const [stream] = event.streams;
      setRemoteStream(stream);
    };

    const createOffer = async () => {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      // offer를 서버로 전송하는 로직 필요
    };

    createOffer();

    return () => {
      peerConnection.close();
    };
  }, []);

  return (
    <>
      <h1>WebRTC Video Streaming</h1>
      {localStream && (
        <RTCView
          streamURL={localStream.toURL()}
          style={{ width: 600, height: 400 }}
        />
      )}
      {remoteStream && (
        <RTCView
          streamURL={remoteStream.toURL()}
          style={{ width: 600, height: 400 }}
        />
      )}
    </>
  );
};

export default WebRTCClient;
