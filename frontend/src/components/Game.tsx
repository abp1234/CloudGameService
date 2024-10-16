import React,{useState,useEffect} from "react"
//@ts-ignore
import io from'socket.io-client';


const Game=()=>{
    const [choice,setChoice]=useState<string|null>(null);
    const [opponentChoice, setOpponentChoice] = useState<string|null>(null);
    const [result, setResult] = useState<string|null>(null);
    const socket = io('http://localhost:8080')

    useEffect(()=>{
        socket.on('opponentChoice',(data:string)=>{
            setOpponentChoice(data);
            if(choice){
                const gameResult = getResult(choice, data);
                setResult(gameResult);
                socket.emit('gameResult',gameResult);
            }
        });
    },[choice]);

    const getResult=(playerChoice:string, opponentChoice:string)=>{
        if(playerChoice===opponentChoice) return 'Draw';
        if(
            (playerChoice==='rock'&&opponentChoice==='scissors')||
            (playerChoice==='scissors'&&opponentChoice==='paper')||
            (playerChoice==='paper'&&opponentChoice==='rock')
        ){
            return 'Win';
        }
        return 'Lose';
    }

    const handleChoice = (playerChoice:string)=>{
        setChoice(playerChoice);
        socket.emit('playerChoice',playerChoice);
    };

    return (
        <div>
            <h1>Rock, Paper, Scissors</h1>
            <button onClick={()=>handleChoice('rock')}>Rock</button>
            <button onClick={()=>handleChoice('paper')}>Paper</button>
            <button onClick={()=>handleChoice('scissors')}>Scissors</button>
            {result && <h2>Result: {result}</h2>}
        </div>
    )

}