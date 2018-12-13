import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Aptitudes from './Aptitudes';
import CssBaseline from '@material-ui/core/CssBaseline';
import { SnackbarProvider } from 'notistack';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<SnackbarProvider><Aptitudes ><CssBaseline/></Aptitudes></SnackbarProvider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
