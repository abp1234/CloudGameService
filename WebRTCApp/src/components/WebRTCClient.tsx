import React,{useEffect, useRef} from "react";
import { RTCPeerConnection, RTCView,mediaDevices } from "react-native-webrtc";

const WebRTCClient = ()=>{
    const stream = useRef(null);
    const configuration ={
        iceServers:[
            {urls:'stun:stun.l.google.com:19302'},
            {urls:'stun:stun1.l.google.com:19302'}
        ]
    };
    let peerConnection =new RTCPeerConnection(configuration);

    useEffect(()=>{

        peerConnection.ontrack = (event:any)=>{
            stream.current = event.streams[0];
        }

        const createOffer = async()=>{
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
        };
        createOffer();

        return ()=>{
            peerConnection.close();
        }
    },[])

    return(
        <RTCView streamURL={stream.current?.toURL()} style={{width:600,height:400}}/>
    )
}

export default WebRTCClient;