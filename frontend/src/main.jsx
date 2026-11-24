import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <App />
  </StrictMode>,
)
// Once React has loaded, it will smoothly fade out the boot loader and remove it.
const bootLoader = document.getElementById('boot-loader');
if (bootLoader) {
  bootLoader.style.opacity = '0';
  setTimeout(() => bootLoader.remove(), 250);
}
