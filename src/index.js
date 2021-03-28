import React from 'react';
import ReactDOM from 'react-dom';
import "./Assets/styles/font/stylesheet.css";
import "./Assets/styles/css/main.css";
import "react-app-polyfill/ie9";
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import Router from './Router';

ReactDOM.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
  document.getElementById('root')
);
