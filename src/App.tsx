import React from 'react';
import './styles/App.css';
import NavBar from './components/NavBar';
import { BrowserRouter } from 'react-router-dom';
import Navigator from './components/Navigator';
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar />
        <div className="page-content">
          <Navigator />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
