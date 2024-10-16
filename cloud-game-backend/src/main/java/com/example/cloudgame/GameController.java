package com.example.cloudgame;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GameController {

    @GetMapping("/game/start")
    public String startGame() {
        return "게임이 시작되었습니다!";
    }

    @GetMapping("/game/status")
    public String getGameStatus() {
        return "게임이 진행 중입니다.";
    }

    @GetMapping("/game/end")
    public String endGame() {
        return "게임이 종료되었습니다.";
    }
}
