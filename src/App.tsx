import { useState } from 'react'
import HubDevicesDisplay from './customComponents/HubDevicesDisplay/HubDevicesDisplay'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>

      <HubDevicesDisplay />
      
    </>
  )
}

export default App
