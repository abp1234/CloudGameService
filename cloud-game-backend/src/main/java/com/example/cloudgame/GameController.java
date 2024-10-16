package com.example.cloudgame;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class GameController {

    private static final Logger logger = LoggerFactory.getLogger(GameController.class);

    @MessageMapping("/play")
    @SendTo("/topic/result")
    public String playGame(String userChoice) {
        logger.info("Received user's choice: {}", userChoice);  // 디버깅 로그

        String[] choices = {"rock", "paper", "scissors"};
        String serverChoice = choices[(int) (Math.random() * 3)];

        String result;
        if (userChoice.equals(serverChoice)) {
            result = "Draw!";
        } else if ((userChoice.equals("rock") && serverChoice.equals("scissors")) ||
                (userChoice.equals("paper") && serverChoice.equals("rock")) ||
                (userChoice.equals("scissors") && serverChoice.equals("paper"))) {
            result = "You win!";
        } else {
            result = "You lose!";
        }

        logger.info("Server choice: {}, Result: {}", serverChoice, result);  // 디버깅 로그
        return "Server chose " + serverChoice + ". " + result;
    }
}
//@RestController
//public class GameController {
//
//    @GetMapping("/game/start")
//    public String startGame() {
//        return "게임이 시작되었습니다!";
//    }
//
//    @GetMapping("/game/status")
//    public String getGameStatus() {
//        return "게임이 진행 중입니다.";
//    }
//
//    @GetMapping("/game/end")
//    public String endGame() {
//        return "게임이 종료되었습니다.";
//    }
//}
