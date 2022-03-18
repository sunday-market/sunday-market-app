import PrivateRoute from "./Routing/PrivateRoute";
import LandingPage from "./pages/LandingPage/LandingPage";

// Authentication Pages
import RegisterPage from "./pages/Authentication/RegisterPage";
import LoginPage from "./pages/Authentication/LoginPage";
import AccountDeletedPage from "./pages/Account/AccountDeletedPage";
import AccountVerifyPage from "./pages/Authentication/AccountVerifyPage";
import AccountConfirmTokenPage from "./pages/Authentication/AccountConfirmTokenPage";
import ForgotPasswordPage from "./pages/Authentication/ForgotPasswordPage";
import PasswordResetPage from "./pages/Authentication/PasswordResetPage";

// Accounts Pages
import MyAccountPage from "./pages/Account/MyAccountPage"; // Main
import AccountDetailsPage from "./pages/Account/AccountDetailsPage";
import MyStallsPage from "./pages/Account/MyStallsPage";
import MyProducts from "./pages/Products/MyProducts";


// Error Pages
import Error404 from "./pages/Errors/Error404";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route element={<PrivateRoute />}>
          <Route path="account" element={<MyAccountPage />}>
            <Route path="/account" element={<AccountDetailsPage />} />
            <Route path="myaccount" element={<AccountDetailsPage />} />
            <Route path="mystalls" element={<MyStallsPage />} />
            <Route path="myproducts" element={<MyProducts />} />
            {/* <Route path="myorders" element={<MyOrdersPage />} /> */}
            {/* <Route path="ordersreceived" element={<ReceivedOrdersPage />} /> */}
          </Route>
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
        <Route
          path="/passwordreset/:resetToken"
          element={<PasswordResetPage />}
        />

        <Route path="*" element={<Error404 />} />
      </Routes>
    </Router>
  );
}

export default App;
