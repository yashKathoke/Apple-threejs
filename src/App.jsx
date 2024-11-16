import { useState } from 'react'
import Navbar from './components/Navbar'
import { Hero } from './components/Hero'
import Hightlights from './components/Hightlights'
import Model from './components/Model'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <Navbar />
        <Hero />
        <Hightlights />
        <Model />
    </>
  )
}

export default App
