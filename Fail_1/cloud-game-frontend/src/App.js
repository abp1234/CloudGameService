import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import './App.css';

const App = () => {
  const [result, setResult] = useState('');
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    console.log('Attempting to connect to WebSocket...');

    // SockJS + STOMP 클라이언트 설정
    const socket = new SockJS('http://localhost:8080/game')
    // ,{
    //   transports:['websocket', 'polling'],
    //   reconnection:true,
    // });
    const stompClient = Stomp.over(socket);
    stompClient.reconnect_delay = 5000; 
    stompClient.connect({}, (frame) => {
      console.log('Connected to server!', frame);
      
      // '/topic/result'에 대해 구독
      stompClient.subscribe('/topic/result', (message) => {
        console.log('Received message from server:', message.body);
        setResult(message.body);
      });
    }, (error) => {
      console.error('WebSocket connection error:', error);  // 연결 실패 시 오류 로그
    });

    setStompClient(stompClient);

    return () => {
      console.log('Disconnecting from WebSocket...');
      if (stompClient) {
        stompClient.disconnect(() => {
          console.log('Disconnected from WebSocket');  // 연결 해제 시 로그 출력
        });
      }
    };
  }, []);

  // 사용자가 게임을 플레이할 때 호출되는 함수
  const playGame = (choice) => {
    if (stompClient && stompClient.connected) {
      console.log(`Sending player's choice: ${choice}`);
      stompClient.send('/app/play', {}, choice);  // '/app/play'로 메시지 전송
    } else {
      console.error('Socket is not connected!');
    }
  };

  return (
    <div>
      <h1>Rock Paper Scissors</h1>
      <button onClick={() => playGame('rock')}>Rock</button>
      <button onClick={() => playGame('paper')}>Paper</button>
      <button onClick={() => playGame('scissors')}>Scissors</button>
      <h2>{result}</h2>
    </div>
  );
}

export default App;
