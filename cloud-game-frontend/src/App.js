import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import logo from './logo.svg';
import './App.css';

const App = ()=>{
  const [result, setResult] = useState('');
  // const [client, setClient] = useState(null);

  useEffect(()=>{
    const socket = io('http://localhost:8080',{
      transports:['websocket'],
    })
    socket.on('connect',()=>{
      console.log('Connected to server')
    })
    socket.on('result',(message)=>{
      setResult(message);
    })
    return ()=>{
      socket.disconnect();
    }
  },[]);

  const playGame = (choice)=>{
    if(socket){
      socket.emit('play',choice);
    }
  }
    // const socket = new SockJS('http://localhost:8080/game');
    // const stompClient = Stomp.over(() => socket);

    // stompClient.connect({},()=>{
    //   stompClient.subscribe('/topic/result',(message)=>{
    //     setResult(message.body);
    //   })
    // })

    // setClient(stompClient);

  //   return ()=>{
  //     stompClient.disconnect();
  //   }
  // },[]);

  // const playGame =(choice)=>{
  //   if(client){
  //     client.send('/app/play',{},choice);
  //   }
  // }

  return (
    <div>
      <h1>Rock Paper Scissors</h1>
      <button onClick={() => playGame('rock')}>Rock</button>
      <button onClick={() => playGame('paper')}>Paper</button>
      <button onClick={() => playGame('scissors')}>Scissors</button>
      <h2>{result}</h2>
    </div>
  )


}

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export default App;
