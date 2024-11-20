// import React from 'react';

interface ButtonProps {
    currentVolume: {
      mic0: number;
      mic1: number;
      mic2: number;
      mic3: number;
      mic4: number;
      mic5: number;
    };
  }

export const Buttons:React.FC<ButtonProps> = ({currentVolume}) => {


    const startPlaying = async () => {
        console.log("start playing")
        const playUrl = "http://localhost:8000/play";
        const postData = currentVolume;
    
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
        const postData = currentVolume;
    
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
        const postData = currentVolume;
    
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
            <button onClick={startPlaying}> Click me to listen to the ROOM!</button>
            <button onClick={stopPlaying}> Are you sure to stop? </button>
            <button onClick={playEnvironment}> ハウリング(うるさいです) </button>
        </div>
      </>
    )
  };