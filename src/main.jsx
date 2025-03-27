import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Create a root for the app
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

// Set root element to take full width and height
if (rootElement) {
  rootElement.style.width = '100%';
  rootElement.style.height = '100%';
  rootElement.style.display = 'block';
}

// Render the app
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
