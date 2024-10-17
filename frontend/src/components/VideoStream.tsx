import React,{useRef,useEffect,useState} from "react";

const VideoStream: React.FC = ()=>{
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const [peerConnection, setPeerConnection] = useState<RTCPeerConnection|null>(null);

    useEffect(()=>{
        const configuration={
            iceServers: [
                {urls:'stun:stun.l.google.com:19302'},
                {urls:'stun:stun1.1.google.com:19302'}
            ]
        }

        const pc = new RTCPeerConnection(configuration);
        setPeerConnection(pc);

        navigator.mediaDevices.getUserMedia({video:true, audio:true})
        .then(stream=>{
            if(localVideoRef.current){
                localVideoRef.current.srcObject=stream;
            }
            stream.getTracks().forEach(track=>pc.addTrack(track, stream));
        })
        .catch(error =>{
            console.error('Error accessing media devices. ', error);
        });

        pc.ontrack = event=>{
            if(remoteVideoRef.current && event.streams.length>0){
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        }

        pc.onicecandidate = event =>{
            if(event.candidate){
                console.log('New ICE candidate: ', event.candidate);
            }
        }
        return ()=>{
            pc.close();
        }
    },[]);

    const createOffer = async()=>{
        if(peerConnection){
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            console.log('Offer created and set: ', offer);
        }
    }

    const handleAnswer = async(answer: RTCSessionDescriptionInit)=>{
        if(peerConnection){
            await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
            console.log('Answer received and set. ');
        }
    };

    return(
        <div>
            <h1>WebRTC Video Streaming</h1>
            <div>
                <h3>Local</h3>
            </div>
        </div>
    )

}