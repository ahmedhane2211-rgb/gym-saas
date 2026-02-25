import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../i18n.js'
import App from './App.jsx'
import './App.css'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
createRoot(document.getElementById('root')).render(

  <Provider store={store}>
      <Toaster />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
)
