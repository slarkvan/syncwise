import React from 'react'
import ReactDOM from 'react-dom/client'
import { GeistProvider, CssBaseline } from '@geist-ui/core'
import { App } from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <GeistProvider>
            <CssBaseline />
            <App />
        </GeistProvider>
    </React.StrictMode>
)
