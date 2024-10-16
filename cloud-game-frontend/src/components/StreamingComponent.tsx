import React, { useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import SimplePeer, { Instance, SignalData } from 'simple-peer';

const StreamingComponent: React.FC = () => {
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const peerRef = useRef<Instance | null>(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:8081',{
      transports:['websocket','polling'],
    });

    socketRef.current.on('signal', (data: SignalData) => {
      peerRef.current?.signal(data);
    });

    peerRef.current = new SimplePeer({
      initiator: true,
      trickle: false,
    });

    peerRef.current.on('signal', (data: SignalData) => {
      socketRef.current?.emit('signal', data);
    });

    peerRef.current.on('stream', (stream: MediaStream) => {
      if (videoElementRef.current) {
        videoElementRef.current.srcObject = stream;
      }
    });

    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      const { alpha, beta, gamma } = event;
      socketRef.current?.emit('gyroData', { alpha, beta, gamma });
    };

    window.addEventListener('deviceorientation', handleDeviceOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, []);

  return <video ref={videoElementRef} autoPlay={true} />;
};

export default StreamingComponent;
