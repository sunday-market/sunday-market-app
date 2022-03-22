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

// Stalls Pages
import MyStallsPage from "./pages/Stalls/MyStallsPage";

// Products Pages
import MyProducts from "./pages/Products/MyProducts";
import AddProduct from "./pages/Products/AddProduct";

// Message Pages
import Message from "./components/Messages/Message";

// Orders Pages
//import MyOrders from "./pages/Orders/MyOrders";

// Error Pages
import Error404 from "./pages/Errors/Error404";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import AddMyStallPage from "./pages/Stalls/AddMyStallPage";
import ViewStallPage from "./pages/Stalls/ViewStallPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Private Routes  */}
        <Route element={<PrivateRoute />}>
          <Route path="account" element={<MyAccountPage />}>
            <Route path="/account" element={<AccountDetailsPage />} />
            <Route path="myaccount" element={<AccountDetailsPage />} />

            {/* Products Pages  */}
            <Route path="products">
              <Route path="myproducts" element={<MyProducts />} />
              <Route path="add" element={<AddProduct />} />
            </Route>

            <Route path="stalls">
              <Route path="mystalls" element={<MyStallsPage />} />
              <Route path="addstall" element={<AddMyStallPage />} />
              <Route path="viewstall/:stallID" element={<ViewStallPage />} />
            </Route>

            <Route path="orders">
              {/* <Route path="myorders" element={<MyOrders />} /> */}
              {/* <Route path="ordersreceived" element={<ReceivedOrdersPage />} /> */}
            </Route>

            <Route path="message">
              <Route path="mymessages" element={<Message />}/>
            </Route>
          </Route>
        </Route>

        {/* Public Routes  */}
        <Route path="/" element={<LandingPage />} />
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
