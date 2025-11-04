import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import OCR_Convert from "./pages/OCR_Convert";
import OCR_History from "./pages/OCR_History";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="OCR_Convert" element={<OCR_Convert />} />
          <Route path="OCR_History" element={<OCR_History />} />
          <Route path="Profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
