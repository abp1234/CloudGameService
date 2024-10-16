package com.example.cloudgame.global;

import com.corundumstudio.socketio.SocketIOServer;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration; // Spring의 Configuration

@Configuration
public class SocketIOConfig {


    private static final Logger logger = LoggerFactory.getLogger(SocketIOConfig.class);
    private SocketIOServer server; // SocketIOServer 타입으로 선언

    @Bean
    public SocketIOServer socketIOServer() {
        // netty-socketio의 Configuration을 사용할 때 전체 경로로 명시
        com.corundumstudio.socketio.Configuration config = new com.corundumstudio.socketio.Configuration();
        config.setHostname("localhost");
        config.setPort(8080);
        config.setAllowCustomRequests(true);
        config.setOrigin("*");

        server = new SocketIOServer(config); // SocketIOServer 객체 생성

        logger.info("Socket.IO Server started on port 8080");

        server.addEventListener("play",String.class,(client,data,ackSender)->{
            logger.info("Received play event from client: {}", data);
            String result = processGame(data);
            logger.info("Sending result to client: {}",result);
            client.sendEvent("result", result);
        });



        server.start(); // 서버 시작

        return server; // 서버 인스턴스 반환
    }

    private String processGame(String userChoice){
        String[] choices = {"rock","paper","scissors"};
        String serverChoice = choices[(int) (Math.random()*3)];

        String result;
        if(userChoice.equals(serverChoice)){
            result = "Draw!";
        }else if((userChoice.equals("rock") && serverChoice.equals("scissors")) ||
                (userChoice.equals("paper") && serverChoice.equals("rock"))||
                (userChoice.equals("scissors") && serverChoice.equals("paper"))){
            result = "You win!";
        }else{
            result = "You lose!";
        }

        return "Server chose "+ serverChoice+". "+result;
    }

    @PreDestroy
    public void stopSocketIOServer() {
        if (server != null) {
            logger.info("Stopping Socket.IO Server");
            server.stop(); // 서버 중지
        }
    }
}
