import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

//REACT REDUX TO BE ADDED
import {createStore} from "redux";
// import rootReducer from "./redux/reducer"

ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
    //from html file
  );

serviceWorker.unregister();