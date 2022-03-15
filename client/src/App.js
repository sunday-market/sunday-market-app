import PrivateRoute from "./Routing/PrivateRoute";
import LandingPage from "./pages/LandingPage/LandingPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import RegisterConfirmationPage from "./pages/RegisterConfirmationPage/RegisterConfirmationPage"
import LoginPage from "./pages/LoginPage/LoginPage";
import AccountsPage from "./pages/AccountsPage/AccountsPage"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route element={<PrivateRoute />}>
          <Route path="/account" element={<AccountsPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/registerconfirmation" element={<RegisterConfirmationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
