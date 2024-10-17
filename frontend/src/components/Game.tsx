import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore
import s from '../asset/가위.png'
// @ts-ignore
import r from '../asset/바위.png'
// @ts-ignore
import p from '../asset/보.png'

let socket: WebSocket | null = null;  // WebSocket을 전역에서 한 번만 생성

interface GameResult {
    playerChoice: string;
    opponentChoice: string;
    result: string;
}

const Game: React.FC = () => {
    const [choice, setChoice] = useState<string | null>(null);
    const [opponentChoice, setOpponentChoice] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const socketRef = useRef<WebSocket | null>(null);  // WebSocket을 useRef로 선언

    useEffect(() => {
        if (!socketRef.current) {
        const newSocket = new WebSocket('ws://localhost:8080/game');
        socketRef.current = newSocket;
        newSocket.onopen = () => {
            console.log("WebSocket connection established");
        };

        newSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'opponentChoice') {
                setOpponentChoice(data.choice);
                console.log("Opponent choice received: ", opponentChoice);
            } else if (data.type === 'gameResult') {
                setResult(data.result);
                console.log("Game result received: ", result);
            }
        };

        newSocket.onerror = (error) => {
            console.error("WebSocket error: ", error);
        };

        newSocket.onclose = () => {
            console.log("WebSocket connection closed");
            socketRef.current = null; 
        };

        setSocket(newSocket);

        return () => {
            // if (socketRef.current) {
            //     socketRef.current.close(); // 컴포넌트가 언마운트될 때 WebSocket을 닫음
            // }
            // newSocket.close();
        };
    }
    }, []);

    const handleChoice = (playerChoice: string) => {
        if (socket) {
            setChoice(playerChoice);
            socket.send(JSON.stringify({ type: 'playerChoice', choice: playerChoice }));
        }else {
            console.error("WebSocket is not open");
        }
    };

    return (
        <div>
            <h1>가위바위보 게임</h1>
            <img src={s} alt="가위" onClick={() => handleChoice('scissors')} />
            <img src={r} alt="바위" onClick={() => handleChoice('rock')} />
            <img src={p} alt="보" onClick={() => handleChoice('paper')} />

            {opponentChoice && <h2>상대의 선택: {opponentChoice}</h2>}
            {result && <h2>결과: {result}</h2>}
        </div>
    );
};

export default Game;





// const socket = io('http://localhost:8080', {
    //     withCredentials: true,
    //     transports: ['websocket', 'polling']
    // });

    // useEffect(()=>{
    //     socket.on('opponentChoice',(data: string)=>{
    //         setOpponentChoice(data);
    //     })
    //     socket.on('gameResult',(data:string)=>{
    //         setResult(data);
    //     })

    //     return ()=>{
    //         socket.off('opponentChoice')
    //         socket.off('gameResult')
    //     }
    // },[])
    // const handleChoice = (playerChoice: string)=>{
    //     setChoice(playerChoice);
    //     socket.emit('playerChoice',playerChoice);
    // }a