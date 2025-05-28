import React from 'react'
import ReactDom from "react-dom/client"
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'

ReactDom.createRoot(document.getElementById('root')).render(
<BrowserRouter>
<AuthProvider>
<React.StrictMode>
    <App />
  </React.StrictMode>,
</AuthProvider>
</BrowserRouter>
)
