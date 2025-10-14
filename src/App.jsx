import { BrowserRouter, Routes, Route } from "react-router";
import { CookiesProvider } from "react-cookie";
import { Toaster } from "sonner";

import HomePage from "./pages/HomePage";
import RulesPage from "./pages/RulesPage";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import MegaPage from "./pages/MegaPage.jsx";
import LoginPage from "./pages/AuthLogin.jsx";
import SignupPage from "./pages/AuthSignup.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import HanziPage from "./pages/HanziPage.jsx";
import InvalidHanziPage from "./pages/InvalidHanziPage.jsx";
import HanziPageEdit from "./pages/HanziPageEdit.jsx";
import MeaningPageAdd from "./pages/MeaningAdd.jsx";
import MeaningPageEdit from "./pages/MeaningEdit.jsx";
import UnauthorisedPage from "./pages/UnauthorisedPage.jsx";
import UserPage from "./pages/UserPage.jsx";
import UserboardPage from "./pages/UserboardPage.jsx";
import NotFoundUser from "./pages/NotFoundUser.jsx";
import UserPageAdd from "./pages/UserPageAdd.jsx";
import UserPageEdit from "./pages/UserPageEdit.jsx";
import EditsPage from "./pages/EditsPage.jsx";
import LogoutPage from "./pages/AuthLogout.jsx";
import UserEditsPage from "./pages/UserEditsPage.jsx";

function App() {
  return (
    <CookiesProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/rules" element={<RulesPage />}></Route>
          <Route path="/about" element={<AboutPage />}></Route>
          <Route path="/h" element={<MegaPage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/signup" element={<SignupPage />}></Route>
          <Route path="/logout" element={<LogoutPage />}></Route>
          <Route path="/h/:id" element={<HanziPage />}></Route>
          <Route path="/h/edit/:id" element={<HanziPageEdit />}></Route>
          <Route path="/h/edits/:id" element={<EditsPage />}></Route>
          <Route path="/m/add/:id" element={<MeaningPageAdd />}></Route>
          <Route path="/m/edit/:id" element={<MeaningPageEdit />}></Route>
          <Route path="/u/" element={<UserboardPage />}></Route>
          <Route path="/u/view/:id" element={<UserPage />}></Route>
          <Route path="/u/add" element={<UserPageAdd />}></Route>
          <Route path="/u/edit/:id" element={<UserPageEdit />}></Route>
          <Route path="/u/edits/:id" element={<UserEditsPage />}></Route>

          {/*error pages */}
          <Route path="/h/invalid" element={<InvalidHanziPage />}></Route>
          <Route path="/unauthorised" element={<UnauthorisedPage />}></Route>
          <Route path="/u/notfound" element={<NotFoundUser />}></Route>
          <Route path="*" element={<NotFoundPage />}></Route>
        </Routes>
        <Toaster position="top-right" />
        <Footer />
      </BrowserRouter>
    </CookiesProvider>
  );
}

export default App;
