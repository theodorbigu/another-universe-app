import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import ImageGeneration from "./components/ImageGeneration";
import ImageEditing from "./components/ImageEditing";
import Creations from "./components/Creations";
import SliderPage from "./components/SliderPage";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import { AuthProvider } from "./context/AuthContext";
import Profile from "./components/Profile/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import PaymentSuccess from "./components/Payment/PaymentSuccess";
import CreditsPage from "./components/Credits/CreditsPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route
              path="generate"
              element={
                <ProtectedRoute>
                  <ImageGeneration />
                </ProtectedRoute>
              }
            />
            <Route
              path="edit"
              element={
                <ProtectedRoute>
                  <ImageEditing />
                </ProtectedRoute>
              }
            />
            <Route
              path="creations"
              element={
                <ProtectedRoute>
                  <Creations />
                </ProtectedRoute>
              }
            />
            <Route path="slider" element={<SliderPage />} />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="payment-success"
              element={
                <ProtectedRoute>
                  <PaymentSuccess />
                </ProtectedRoute>
              }
            />
            <Route
              path="credits"
              element={
                <ProtectedRoute>
                  <CreditsPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
