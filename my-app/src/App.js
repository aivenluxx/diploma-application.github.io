import { Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage/MainPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import PasswordRenewal from './components/PasswordRenewal/PasswordRenewal';
import EmailPasswordRecovery from './components/E-mailPasswordRecovery/EmailPasswordRecovery';
import EmailConfirmLetter from './components/E-mailConfirmLetter/EmailConfirmLetter';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path ="/passwordrecovery" element = {<PasswordRenewal/>} />
        <Route path ="/emailpasswordrecovery" element = {<EmailPasswordRecovery/>} />
        <Route path ="/emailconfirmationletter" element = {<EmailConfirmLetter/>} />
        <Route path = "/dashboard" element = {<Dashboard/>} />
      </Routes> 
    </div>
  );
}

export default App;