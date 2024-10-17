package com.example.game.rsp;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.HashMap;
import java.util.Map;

public class GameHandler extends TextWebSocketHandler {
    private Map<String, WebSocketSession> players = new HashMap<>();
    private Map<String, String> choices = new HashMap<>();
    private WebSocketSession defensePlayer;
    private WebSocketSession offensePlayer;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception{
        System.out.println("WebSocket connection established: Session ID - " + session.getId());
        if (players.size() < 2) {
            players.put(session.getId(), session);
            System.out.println("Player added. Total players: " + players.size());
            // 첫 번째 플레이어는 수비자로 설정
            if (defensePlayer == null) {
                defensePlayer = session;
                System.out.println("Defense player set. Session ID: " + session.getId());
            } else if (offensePlayer == null) {
                // 두 번째 플레이어는 공격자로 설정
                offensePlayer = session;
                System.out.println("Offense player set. Session ID: " + session.getId());
            }
            } else {
            session.close(CloseStatus.GOING_AWAY);  // 두 명 이상의 플레이어는 연결을 끊음
        }
    }


    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception{
        try {
            String payload = message.getPayload();
            System.out.println("Received message: " + payload);

            if (payload.startsWith("{\"type\":\"playerChoice\"")) {
                String playerChoice = payload.split(":")[2].replace("\"", "").replace("}", "");
                System.out.println("Player choice received: " + playerChoice);
                choices.put(session.getId(), playerChoice);

//                // 첫 번째 플레이어는 수비자로 설정
//                if (defensePlayer == null) {
//                    defensePlayer = session;
//                    System.out.println("Defense player set. Session ID: " + session.getId());
//                }

//                // 두 번째 플레이어는 공격자로 설정
//                if (offensePlayer == null && session != defensePlayer) {
//                    offensePlayer = session;
//                    System.out.println("Offense player set. Session ID: " + session.getId());
//                } else if (session == defensePlayer) {
//                    System.out.println("This player is the defense player, not offense.");
//                }

                if (players.size() == 2) {
//                    offensePlayer = session;  // 두 번째로 선택한 플레이어는 공격자
//                    System.out.println("Offense player set.");
                    WebSocketSession opponent = session == defensePlayer ? offensePlayer : defensePlayer;
                    System.out.println("Two players found. Processing game...");
//                    WebSocketSession opponent = players.values().stream()
//                            .filter(s -> !s.getId().equals(session.getId()))
//                            .findFirst()
//                            .orElse(null);

//                    String opponentChoice = choices.get(opponent.getId());

                    // 상대방이 아직 선택하지 않은 경우
//                    if (offensePlayer == null) {
//                        System.out.println("Waiting for opponent to make a choice.");
//                        return;
//                    }
                    if (offensePlayer != null) {
                        String opponentChoice = choices.get(opponent.getId());
                        // 상대방이 선택을 마친 경우
                        if (opponentChoice == null) {
                            System.out.println("Waiting for opponent to make a choice.");
                            return;
                        }
                        // 결과 계산
                        String resultForPlayer = getResult(playerChoice, opponentChoice);
                        String resultForOpponent = getResult(opponentChoice, playerChoice);

                        System.out.println("Sending result to players...");

                        // 각 유저에게 결과 전송
                        session.sendMessage(new TextMessage("{\"type\":\"gameResult\",\"result\":\"" + resultForPlayer + "\"}"));
                        opponent.sendMessage(new TextMessage("{\"type\":\"gameResult\",\"result\":\"" + resultForOpponent + "\"}"));
                        // 게임이 끝났으므로 플레이어 목록을 초기화
                        resetGame();
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error processing message: " + e.getMessage());
            e.printStackTrace();  // 예외가 발생할 경우 콘솔에 로그 출력
        }
    }
    // 게임 상태 초기화
    private void resetGame() {
        System.out.println("Game reset.");
        players.clear();
        choices.clear();
        offensePlayer = null;
        defensePlayer = null;
    }
    private String getResult(String playerChoice, String opponentChoice){
        if(playerChoice.equals(opponentChoice)) return  "Draw";
        if ((playerChoice.equals("rock") && opponentChoice.equals("scissors")) ||
                (playerChoice.equals("scissors") && opponentChoice.equals("paper")) ||
                (playerChoice.equals("paper") && opponentChoice.equals("rock"))) {
            return "Win";
        }
        return "Lose";
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception{
        System.out.println("WebSocket connection closed: Session ID - " + session.getId() + ", Status: " + status);
        players.remove(session.getId());
        choices.remove(session.getId());
        // 한 명이 연결을 끊으면 게임 초기화
        if (session == offensePlayer || session == defensePlayer) {
            resetGame();
        }
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception{
        System.err.println("WebSocket transport error: Session ID - " + session.getId() + ", Error: " + exception.getMessage());
//        players.remove(session.getId());
    }


}
