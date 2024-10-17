package com.example.game.gamerendering.service;

public class WebRTCStreamingService
{
    private PeerConnection peerConnection;
    private VideoTrack localVideoTrack;

    public void setupWebRTCConnection(PeerConnectionFactory peerConnectionFactory, GameRenderingService renderingService){
        PeerConnection.RTCConfiguration rtcConfig = new PeerConnection.RTCConfiguration(iceServers);
        peerConnection = peerConnectionFactory.createPeerConnection(rtcConfig, new PeerConnection.Observer(){
            @Override
            public void onIceCandiate(IceCandidate iceCandidate){

            }
            @Override
            public void onAddStream(MediaStream mediaStream){

            }
            @Override
            public void onDataChannel(DataChannel dataChannel){

            }
        });
        VideoSource videoSource = peerConnectionFactory.createVideoSource(false);
        localVideoTrack = peerConnectionFactory.createVideoTrack("videoTrack", videoSource);

        renderingService.stopGameRendering("gamel",localVideoTrack.getVideoSink());
    }

    public void stopStreaming(){
        if(peerConnection!=null){
            peerConnection.close();
        }
    }

}
