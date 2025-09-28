import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { PublicLayout } from "@/layouts/public-layout";
import AuthenticationLayout from "@/layouts/auth-layout";
import { MainLayout } from "@/layouts/main-layout";

import HomePage from "@/routes/home";
import SignInPage from "@/routes/sign-in";
import SignUpPage from "@/routes/sign-up";
import ProtectedRoutes from "@/layouts/protected-routes";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout/>}>
        <Route index element={<HomePage/>} />
        </Route>

        {/* Authentication Routes */}
        <Route element={<AuthenticationLayout/>}>
        <Route path="/signin/*" element={<SignInPage/>} />
        <Route path="/signup/*" element={<SignUpPage/>} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoutes><MainLayout /></ProtectedRoutes>}>

        {/* Add all the protected Routes */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;