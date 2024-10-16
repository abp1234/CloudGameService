package com.example.cloudgame;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

public class SignalHandler extends TextWebSocketHandler {

    private final Set<WebSocketSession> sessions = Collections.synchronizedSet(new HashSet<>());

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception{
        sessions.add(session);
    }


    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        try {
            // 연결된 모든 세션에 메시지를 브로드캐스트
            for (WebSocketSession webSocketSession : sessions) {
                if (webSocketSession.isOpen() && !webSocketSession.equals(session)) {
                    webSocketSession.sendMessage(message); // 다른 클라이언트에게 메시지 전송
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status) throws Exception{
        sessions.remove(session);
    }
}
