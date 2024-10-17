import React, {useEffect, useRef} from 'react';

const WebRTCClient: React.FC = ()=>{
    const videoRef = useRef<HTMLVideoElement>(null);
    let peerConnection: RTCPeerConnection;

    useEffect(()=>{
        const configuration = {
            iceServers:[
                {urls:'stun:stun.l.google.com:19302'},
                {urls:'stun:stun1.l.google.com:19302'}
            ]
        };

        peerConnection = new RTCPeerConnection(configuration);

        peerConnection.ontrack=(event)=>{
            if(videoRef.current){
                videoRef.current.srcObject = event.streams[0];
            }
        }

        peerConnection.onicecandidate=(event)=>{
            if(event.candidate){

            }
        }

        const createOffer = async ()=>{
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
        }
        createOffer();
        return ()=>{
            peerConnection.close();
        }
    },[]);
    return (
        <div>
            <h1>WebRTC Video Streaming</h1>
            <video ref={videoRef} autoPlay style={{width:'600px',height:'400px'}}/>
        </div>
    )
}

export default WebRTCClient;