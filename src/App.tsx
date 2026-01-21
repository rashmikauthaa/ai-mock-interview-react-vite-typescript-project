import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { PublicLayout } from "@/layouts/public-layout";
import AuthenticationLayout from "@/layouts/auth-layout";
import MainLayout from "./layouts/main-layout";

import HomePage from "@/routes/home";
import SignInPage from "@/routes/sign-in";
import SignUpPage from "@/routes/sign-up";
import ProtectedRoutes from "@/layouts/protected-routes";
import Generate from "./components/generate";
import { Dashboard } from "./routes/dashboard";
import { CreateEditPage } from "./routes/create-edit-page";
import { MockInterviewPage } from "./routes/mock-interview-page";
import { Feedback } from "./routes/feedback";
import { MockLoadPage } from "./routes/mock-load-page";
import AboutPage from "./routes/about";
import ServicesPage from "./routes/services";
import ContactPage from "./routes/contact";
import { Analytics } from "./routes/analytics";
import { ATSScorePage } from "./routes/ats-score";
import NotFound from "./routes/not-found";
import { ScrollToTop } from "./components/scroll-to-top";

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* Authentication Routes */}
        <Route element={<AuthenticationLayout />}>
          <Route path="/signin/*" element={<SignInPage />} />
          <Route path="/signup/*" element={<SignUpPage />} />
        </Route>

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoutes>
              <MainLayout />
            </ProtectedRoutes>
          }
        >
          {/* Add all the protected Routes */}
          <Route path="/generate" element={<Generate />} >
            <Route index element={<Dashboard />} />
            <Route path="analytics" element={<Analytics />} />

            {/* Create route*/}
            <Route path=":interviewId" element={<CreateEditPage />} />
            <Route path="interview/:interviewId" element={<MockLoadPage />} />
            <Route
              path="interview/:interviewId/start"
              element={<MockInterviewPage />}
            />
            <Route path="feedback/:interviewId" element={<Feedback />} />
          </Route>
          
          {/* Resume Analysis */}
          <Route path="/ats-score" element={<ATSScorePage />} />
        </Route>

        {/* 404 Route - Catch all unmatched routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;