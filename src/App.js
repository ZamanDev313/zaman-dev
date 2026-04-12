import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import your components
import Navbar from "./Components/Navbar";
import About from "./Components/About";
import Footer from "./Components/Footer";
import Education from "./Components/Eduaction";
import Home from "./Components/Home";
import Skills from "./Components/Skills";
import Projects from "./Components/Projects";
import Contact from "./Components/Contact";
import ScrollToTop from "./Components/ScrollToTop";
import Resume from "./Components/Resume";
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/education" element={<Education />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/resume" element={<Resume />} />
      </Routes>
      <ScrollToTop /> {/* Optional: Scroll-To-Top */}
      <Footer />
    </Router>
  );
}

export default App;
