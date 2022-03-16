import PrivateRoute from "./Routing/PrivateRoute";
import LandingPage from "./pages/LandingPage/LandingPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import AccountsPage from "./pages/AccountsPage/AccountsPage";
import AccountDeletedPage from "./pages/AccountDeletedPage/AccountDeletedPage";
import AccountVerifyPage from "./pages/AccountVerify/AccountVerifyPage";
import AccountConfirmTokenPage from "./pages/AccountConfirmToken/AccountConfirmTokenPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage/ForgotPasswordPage";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import MyStallsPage from "./components/MyStalls";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route element={<PrivateRoute />}>
          <Route path="/account" element={<AccountsPage />} />
          <Route path="/mystalls" element={<MyStallsPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/verify/:verificationToken"
          element={<AccountConfirmTokenPage />}
        />
        <Route path="/accountverify" element={<AccountVerifyPage />} />
        <Route path="/accountdeleted" element={<AccountDeletedPage />} />
        <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
      
      </Routes>
    </Router>
  );
}

export default App;
