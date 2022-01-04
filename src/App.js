import { isUndefined } from "lodash";
import { useState } from "react";
import { useJwt } from "react-jwt";
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';



function App() {



  const adminToken = !isUndefined(localStorage.getItem("adminToken")) ? localStorage.getItem("adminToken") : ""
  const { decodedToken, isExpired } = useJwt(adminToken)


  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={!isExpired ? <Dashboard /> : <AuthPage authType={0} />} />
          <Route path="/signin" element={<AuthPage authType={0} />} />
          <Route path="/signup" element={<AuthPage authType={1} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
