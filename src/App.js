import React, { useState, useRef } from 'react';
import './index.css';

function App() {

  //State for managing recording status and audio data.
  const [isRecording, setIsRecording] = useState(false); //initializing a state var to track the recording status.
  const [audioBlob, setAudioBlob] = useState(null); //for storing recorded audio data.

  //Refs for accessing MediaRecorder and audio elements
  const mediaRecorderRef = useRef(null); //useRef is a react hook which interact or access with DOM ,
//it provides a way to create a mutable object (which can be changed after intializing the value) whose current property
// hold reference of dom, and this will return a mutable object with current property.

//This line creates a ref named audioRef using the useRef hook. The initial value of the ref (current) is set to null.
  const audioRef = useRef(null);

  const startRecording = async () => {
    try {
      // Request access to the user's microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      //navigator object is part of web API provides info about browser enviornmet.
      //mediaDevices is property of navigator is used to access media input devices.
      //getUserMedia is method used to prompt the user for permission to use the media devices.
      //{ audio: true } this constraint is true its mean that it is requesting acess to audio input.

      const mediaRecorder = new MediaRecorder(stream);
      //MediaRecorder is a Web API interface that provides functionality to record media, typically audio and video.
//stream:- (in this case, the user's microphone stream). The recorded data can then be processed, saved, or played back as needed.
      
      const audioChunks = [];
       //The variable audioChunks is an array used to store chunks of recorded audio data.

      mediaRecorder.ondataavailable = (event) => { //in case of mediaRecorder when recording audio, the data is generated
    // in chunks, and these chunks are made available through the ondataavailable event.Here ondataavailable is event which
    //is fired when new data is available.

        if (event.data.size > 0) {
          //you typically check if the size of the data is greater than 0 (i.e., there is actual data),
          // and then you store this data in an array.
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        //The Blob constructor takes an array of data chunks (in this case, the audio chunks) and an 
        //options object. The options object specifies the MIME type of the data, in this case, 'audio/wav'
        
        setAudioBlob(audioBlob);
        //This line sets the state variable audioBlob in the React component to the newly created Blob. 
        //Setting state triggers or re-render the component with the updated state.
      };

      // Save reference for stopping recording
      mediaRecorderRef.current = mediaRecorder; //mediaRecorderRef is likely created using the useRef hook, and 
      //current is the property where the actual reference is stored.
      
      mediaRecorder.start(); //starts the recording using the start() method .
      
      setIsRecording(true); //The state variable is likely used to keep track of whether the recording is currently in progress.
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  //it is likely used as an event handler for a button or an action that triggers the end of the recording process.
  const stopRecording = () => {
    if (mediaRecorderRef.current) { //this condn states that mediaRecorderRef.current exist nd it is not null or undefined.
      //it states that recording is available before stop the recording.

      mediaRecorderRef.current.stop();//If the condition is true, it calls the stop() method on the MediaRecorder instance.
      
      setIsRecording(false);//After stopping the recording, the state variable isRecording is set to false using the setIsRecording function. 
      //This state update reflects that the recording has ended.
    }
  };

  //the playRecording function checks if there is recorded audio (audioBlob), creates a URL for the audio data, sets the 
  //src of an audio element to that URL, and then plays the audio. This function is likely associated with an action that
  // triggers the playback of the recorded audio, such as clicking a "Play Recording" button.
  const playRecording = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current.src = audioUrl;
      audioRef.current.play();
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className={`chat-container ${isRecording ? 'recording' : ''}`}>
            <div className="audio-controls">
              {/* isRecording is true, the button will have an additional class 'recording', which can be used for styling purposes*/}
              <button
                className={`btn btn-primary ${isRecording ? 'recording' : ''}`}
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </button>
              <button
                className="btn btn-success"
                onClick={playRecording}
                disabled={!audioBlob}
              >
                {/*The disabled attribute is set to true if there is no recorded audio (audioBlob is falsy),
                preventing the button from being clickable when there is nothing to play. */}

                Play Recording
              </button>
            </div>
            <audio ref={audioRef} controls style={{ marginTop: '10px' }} />
         {/* controls attribute adds default playback controls to the audio element (play, pause, volume, etc.). */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
