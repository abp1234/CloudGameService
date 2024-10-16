package com.example.cloudgame.global;

import com.corundumstudio.socketio.SocketIOServer;
import jakarta.annotation.PreDestroy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration; // Spring의 Configuration

@Configuration
public class SocketIOConfig {

    private SocketIOServer server; // SocketIOServer 타입으로 선언

    @Bean
    public SocketIOServer socketIOServer() {
        // netty-socketio의 Configuration을 사용할 때 전체 경로로 명시
        com.corundumstudio.socketio.Configuration config = new com.corundumstudio.socketio.Configuration();
        config.setHostname("localhost");
        config.setPort(8083);

        server = new SocketIOServer(config); // SocketIOServer 객체 생성
        server.start(); // 서버 시작

        return server; // 서버 인스턴스 반환
    }

    @PreDestroy
    public void stopSocketIOServer() {
        if (server != null) {
            server.stop(); // 서버 중지
        }
    }
}
