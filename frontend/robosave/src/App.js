import React from 'react';
import './App.css';

import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Login from './components/login/login';
import Dashboard from './components/dashboard/dashboard';
import Payment from './components/payment/payment';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/payment" element={<Payment/>}/>
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
