// import { useState } from 'react'
import './App.css'
import {Header} from './components/Header.tsx'
import {SlideBar} from './components/SlideBarSet.tsx'
import {MeshPage} from './components/MeshPage.tsx'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <Header />
      <SlideBar />
      <MeshPage />
      {/* <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div> */}
    </>
  )
}

export default App
