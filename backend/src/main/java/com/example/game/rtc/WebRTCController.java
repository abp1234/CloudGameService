package com.example.game.rtc;


import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

@Controller
@CrossOrigin
public class WebRTCController {

    private final SimpMessagingTemplate messagingTemplate;

    public WebRTCController(SimpMessagingTemplate messagingTemplate){
        this.messagingTemplate=messagingTemplate;
    }

    @MessageMapping("/signal")
    public void signaling(String message){
        messagingTemplate.convertAndSend("/topic/signal",message);
    }


}
