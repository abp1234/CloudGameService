package com.example.cloudgame;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketConfig.class);

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        logger.info("Configuring message broker with destination prefixes and simple broker.");

        config.enableSimpleBroker("/topic");  // 클라이언트로 보내는 메시지 경로
        config.setApplicationDestinationPrefixes("/app");  // 클라이언트에서 서버로 보내는 메시지 경로
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        logger.info("Registering STOMP endpoints at /game/info with SockJS enabled.");
        registry.addEndpoint("/game")
                .setAllowedOriginPatterns("*")
                .withSockJS();  // SockJS 엔드포인트
    }
}

//    @Override
//    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
//        // WebSocket 핸들러 등록
////        registry.addHandler(new SignalHandler(), "/signal").setAllowedOrigins("*");
//        registry.addEndpoint("/game").setAllowedOriginPatterns("*").withSockJS();
//    }