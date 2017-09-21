import React from 'react';
import ReactDOM from 'react-dom';
import Component from './Component';

var API_URL = 'http://localhost:3000/';
var container = document.getElementById('app');
ReactDOM.render(<Component API_URL={API_URL}/>, container);
