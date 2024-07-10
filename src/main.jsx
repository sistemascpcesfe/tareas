import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react'
import { TaskProvider } from './provider/taskProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TaskProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </TaskProvider>
  </React.StrictMode>,
)
