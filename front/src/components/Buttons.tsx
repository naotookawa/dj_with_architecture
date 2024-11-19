// import React from 'react';

interface ButtonProps {
    volumeForButton: {
      mic0: number;
      mic1: number;
      mic2: number;
      mic3: number;
      mic4: number;
      mic5: number;
    };
  }

export const Buttons:React.FC<ButtonProps> = ({volumeForButton}) => {

    const startPlaying = async () => {
        console.log("start playing")
        const playUrl = "http://localhost:8000/play";
        const postData = volumeForButton;
    
        const response = await fetch(playUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        })
    
        if (!response.ok) {
          console.error("Error in starting playing")
        }
        return response.json()
      }
    
      const stopPlaying = async () => {
        console.log("stop playing")
        const playUrl = "http://localhost:8000/stop";
        const postData = volumeForButton;
    
        const response = await fetch(playUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        })
    
        if (!response.ok) {
          console.error("Error in stopping playing")
        }
        return response.json()
      }
    
      const playEnvironment = async () => {
        console.log("play environment")
        const playUrl = "http://localhost:8000/play/environment";
        const postData = volumeForButton;
    
        const response = await fetch(playUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        })
    
        if (!response.ok) {
          console.error("Error in playing environment")
        }
        return response.json()
      }

    return (<>
        <div>
            <button onClick={startPlaying}> Click me to play like DJ!</button>
            <button onClick={stopPlaying}> Are you sure to stop? </button>
            <button onClick={playEnvironment}> Listen the environment,,,  </button>
        </div>
      </>
    )
  };