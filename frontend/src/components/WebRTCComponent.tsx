import React,{useEffect} from "react";
import {Client} from '@stomp/stompjs';
import SockJs from'sockjs-client';

const WebRTCComponent: React.FC=()=>{
    useEffect(()=>{
        const socket = new SockJs('http://localhost:8080/signal');
        const stompClient = new Client({
            webSocketFactory: ()=>socket,
            reconnectDelay:5000,
            onConnect:()=>{
                console.log('Connected to signaling server');
                stompClient.subscribe('/topic/signal',(message)=>{
                    console.log('Received signaling message: ', message.body);
                })
            },
            onStompError: (frame)=>{
                console.error('Error with STOMP connection: ', frame.headers['message']);
            }
        })
        stompClient.activate();
        return ()=>{
            stompClient.deactivate();
        }
    },[]);

    return(
        <div>
            <h1>WebRTC Video Stream</h1>
        </div>
    )
}

export default WebRTCComponent;