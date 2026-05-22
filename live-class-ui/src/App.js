import React, { useState } from "react";
import {
  Room,
  createLocalVideoTrack,
  createLocalAudioTrack
} from "livekit-client";

function App() {
  const [room, setRoom] = useState(null);
  const [videoTrack, setVideoTrack] = useState(null);
  const [audioTrack, setAudioTrack] = useState(null);

  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);

  async function joinRoom() {
    try {
      const newRoom = new Room();

      await newRoom.connect(
        "ws://54.87.232.99:7880",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2aWRlbyI6eyJyb29tSm9pbiI6dHJ1ZSwicm9vbSI6InRlc3Ryb29tIn0sImlzcyI6Im15a2V5Iiwic3ViIjoiYmFsYSIsImlhdCI6MTc3OTQzODY3MywiZXhwIjoxNzc5NDYwMjczfQ.kKim5DI6p24QmLI-olVfx3JxHtevQxP-40IswYSZcgg"
      );

      const localVideoTrack = await createLocalVideoTrack();
      const localAudioTrack = await createLocalAudioTrack();

      await newRoom.localParticipant.publishTrack(localVideoTrack);
      await newRoom.localParticipant.publishTrack(localAudioTrack);

      const videoElement = localVideoTrack.attach();

      videoElement.style.width = "700px";
      videoElement.style.height = "500px";
      videoElement.style.objectFit = "cover";
      videoElement.autoplay = true;
      videoElement.playsInline = true;
      videoElement.muted = true;

      document.getElementById("video-container").appendChild(videoElement);

      setRoom(newRoom);
      setVideoTrack(localVideoTrack);
      setAudioTrack(localAudioTrack);

      alert("Joined Live Class");

    } catch (error) {
      console.error(error);
      alert("Connection Failed");
    }
  }

  async function toggleCamera() {
    if (!videoTrack) return;

    if (cameraOn) {
      await videoTrack.mute();
      setCameraOn(false);
    } else {
      await videoTrack.unmute();
      setCameraOn(true);
    }
  }

  async function toggleMic() {
    if (!audioTrack) return;

    if (micOn) {
      await audioTrack.mute();
      setMicOn(false);
    } else {
      await audioTrack.unmute();
      setMicOn(true);
    }
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Live Class</h1>

      <button onClick={joinRoom}>
        Join Live Class
      </button>

      <button
        onClick={toggleCamera}
        style={{ marginLeft: "10px" }}
      >
        {cameraOn ? "Pause Camera" : "Resume Camera"}
      </button>

      <button
        onClick={toggleMic}
        style={{ marginLeft: "10px" }}
      >
        {micOn ? "Mute Mic" : "Unmute Mic"}
      </button>

      <div
        id="video-container"
        style={{ marginTop: "30px" }}
      ></div>
    </div>
  );
}

export default App;
