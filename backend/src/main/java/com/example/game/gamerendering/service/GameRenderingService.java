package com.example.game.gamerendering.service;
import org.webrtc.*;
import java.io.InputStream;

public class GameRenderingService
{
    private Process ffmpegProcess;

    public void startGameRendering(String gameId, VideoSink videoSink) throws Exception{

        String ffmpegCommand = "ffmpeg -f x11grab -r 30 -s 1280x720 -i :0.0+0,0 -f mpegts -";

        ProcessBuilder processBuilder = new ProcessBuilder(ffmpegCommand.split(" "));
        ffmpegProcess = processBuilder.start();

        InputStream inputStream = ffmpegProcess.getInputStream();
        byte[] buffer = new byte[4096];
        int bytesRead;

        while ((bytesRead = inputStream.read(buffer)) != -1){
            videoSink.onFrame(new VideoFrame(new VideoFrame.Buffer(){

            }));
        }

    }

    public void stopGameRendering(){
        if(ffmpegProcess!=null){
            ffmpegProcess.destroy();
        }
    }
}
