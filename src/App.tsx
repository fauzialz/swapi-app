import Axios from 'axios';
import React from 'react';
import './App.css';
import { BASE } from './config/api';
import Router from './router';

Axios.defaults.baseURL = BASE

function App() {
  return <Router />;
}

export default App;
