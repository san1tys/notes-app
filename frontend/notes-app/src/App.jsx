import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import NotFound from './pages/NotFound/NotFound'
import ForgotPasswordScreen from './pages/ForgotPasswordScreen/ForgotPasswordScreen';
import ResetPasswordScreen from './pages/ResetPasswordScreen/ResetPasswordScreen';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to="/login" />} />

        <Route path='/dashboard' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/forgot-password' element={<ForgotPasswordScreen />} />
        <Route path='/reset-password' element={<ResetPasswordScreen />} />


        <Route path='*' element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;