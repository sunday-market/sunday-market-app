import PrivateRoute from "./Routing/PrivateRoute";
import LandingPage from "./pages/LandingPage/LandingPage";
import Support from "./pages/Support";

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
import AddMyStallPage from "./pages/Stalls/AddMyStallPage";
import ViewStallPage from "./pages/Stalls/ViewStallPage";
import EditMyStallPage from "./pages/Stalls/EditMyStallPage";

// Products Pages
import MyProducts from "./pages/Products/MyProducts";
import AddProduct from "./pages/Products/AddProduct";
import ViewProduct from "./pages/Products/ViewProduct";
import EditProduct from "./pages/Products/EditProduct";

// Message Pages
import MessagePage from "./pages/Messages/MessagePage";

// Orders Pages
import Order from "./pages/Orders/Order";
import MyOrders from "./pages/Orders/MyOrders";
import ReceivedOrders from "./pages/Orders/ReceivedOrders";
import ReceivedOrder from "./pages/Orders/ReceivedOrder";

// Shopping Cart Pages
import MyShoppingCartPage from "./pages/ShoppingCartPage/MyShoppingCartPage";

// Search Pages
import Category from "./pages/Search/Category";
import Results from "./pages/Search/Results";

// Error Pages
import Error404 from "./pages/Errors/Error404";

import PageContainer from "./components/PageContainer";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Navbar />}>
          {/* Private Routes  */}
          <Route element={<PrivateRoute />}>
            <Route path="account" element={<MyAccountPage />}>
              <Route path="/account" element={<AccountDetailsPage />} />
              <Route path="myaccount" element={<AccountDetailsPage />} />

              {/* Products Pages  */}
              <Route path="products">
                <Route path="myproducts" element={<MyProducts />} />
                <Route path="add" element={<AddProduct />} />
                <Route path="edit/:productId" element={<EditProduct />} />
              </Route>

              <Route path="stalls">
                <Route path="mystalls" element={<MyStallsPage />} />
                <Route path="addstall" element={<AddMyStallPage />} />
                <Route
                  path="editstall/:stallID"
                  element={<EditMyStallPage />}
                />
              </Route>

              <Route path="orders">
                <Route path="myorders" element={<MyOrders />} />
                <Route path="received" element={<ReceivedOrders />} />
                <Route path="received/:orderid" element={<ReceivedOrder />} />
                <Route path=":orderid" element={<Order />} />
              </Route>

              <Route path="messages" element={<MessagePage />}></Route>
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

          <Route path="products" element={<PageContainer />}>
            <Route path=":productId" element={<ViewProduct />} />
          </Route>

          <Route path="stalls" element={<PageContainer />}>
            <Route path="viewstall/:stallID" element={<ViewStallPage />} />
          </Route>

          <Route path="shoppingcart">
            <Route path="myshoppingcart" element={<MyShoppingCartPage />} />
          </Route>

          <Route path="search">
            <Route path="category/:categoryId" element={<Category />} />
            <Route path="results/" element={<Results />} />
          </Route>

          <Route path="/support" element={<Support />} />

          <Route path="*" element={<Error404 />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
