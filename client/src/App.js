import PrivateRoute from "./Routing/PrivateRoute";
import LandingPage from "./pages/LandingPage/LandingPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SwipeableTextMobileStepper from "./pages/LandingPage/carouselEX";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route element={<PrivateRoute />}>
          {/* <Route path="/" element={<LandingPage />} /> */}
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/omg" element={<SwipeableTextMobileStepper />} />
      </Routes>
    </Router>
  );
}

export default App;
