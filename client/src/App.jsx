import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Onboarding, Dashboard } from './pages';
import { PrivateComponent } from './components';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<PrivateComponent />}>
            <Route path="/" element={<Dashboard />} />
          </Route>
          <Route path="/login" element={<Onboarding />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
