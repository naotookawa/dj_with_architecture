import { useState } from 'react'
// import './App.css'
import {Header} from './components/Header.tsx'
import {SlideBarSet} from './components/SlideBarSet.tsx'
import {MeshPage} from './components/MeshPage.tsx'
import {Buttons} from './components/Buttons.tsx'

function App() {
  const [slideBars, setSlideBars] = useState([
    { id: 0, title: 'スライドバー0', value :-80},
    { id: 1, title: 'スライドバー1', value :-80},
    { id: 2, title: 'スライドバー2', value :-80},
    { id: 3, title: 'スライドバー3', value :-80},
    { id: 4, title: 'スライドバー4', value :-80},
    { id: 5, title: 'スライドバー5', value :-80},
  ])

  const handleChange = async (id: number, value: number) => {
    const playUrl = "http://localhost:8000/volume";
    setSlideBars((slideBars) =>
      slideBars.map((slideBar) =>
        slideBar.id === id ? { ...slideBar, value } : slideBar
      )
    )
    // console.log(slideBars)
    const postData = await {
      "mic0": slideBars[0].value,
      "mic1": slideBars[1].value,
      "mic2": slideBars[2].value,
      "mic3": slideBars[3].value,
      "mic4": slideBars[4].value,
      "mic5": slideBars[5].value
    };

    const response = await fetch(playUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    })

    if (!response.ok) {
      console.error("Error in setting volume")
    }
    return response.json()
  }

  const currentVolume = {
    "mic0": slideBars[0].value,
    "mic1": slideBars[1].value,
    "mic2": slideBars[2].value,
    "mic3": slideBars[3].value,
    "mic4": slideBars[4].value,
    "mic5": slideBars[5].value
  };

  return (
    <div >
      <Header />
      <Buttons currentVolume = {currentVolume}/>
      <SlideBarSet slideBars={slideBars} onSliderChange = {handleChange}/>
      <MeshPage currentVolume = {currentVolume}/>
    </div>
  )
}

export default App;