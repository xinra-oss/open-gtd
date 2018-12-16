import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import './index.scss'
import registerServiceWorker from './registerServiceWorker'
import { BrowserRouter } from 'react-router-dom';

const app = (
    <BrowserRouter>
        <App/>
    </BrowserRouter>
)

ReactDOM.render(app, document.getElementById('root') as HTMLElement)
registerServiceWorker()
