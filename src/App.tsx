import Axios from 'axios';
import React from 'react';
import './App.css';
import { BASE } from './config/api';
import FilmListProvider from './context/filmList';
import Router from './router';

Axios.defaults.baseURL = BASE

function App() {
  return (
    <FilmListProvider>
      <Router />
    </FilmListProvider>
  );
}

export default App;
