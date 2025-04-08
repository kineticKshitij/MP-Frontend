import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Chatbot from "./components/chatbot";
import AuthContainer from "./components/AuthContainer";
import Login from "./components/Login";
import Signin from "./components/Signin";
import EmpDash from "./screen/EmpDash";
import OrgDash from "./screen/OrgDash";
import About from "./components/about";
import Contact from "./components/Contact";
import ManageEmployee from "./components/ManageEmployee";
import AddEmployee from './components/AddEmployee';
import AppInitializer from "./components/AppInitializer";
import MonthlyAttendance from './components/MonthlyAttendance';

function App() {
  return (
    <Router>
      <Navbar /> {/* ✅ Navbar stays outside Routes */}

      <Routes>
        {/* ✅ Show AuthContainer on Home by default */}
        <Route path="/" element={<AuthContainer />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/EmpDash" element={<EmpDash />} />
        <Route path="/OrgDash" element={<OrgDash />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/manageEmployee" element={<ManageEmployee />} />
        <Route path="/addEmployee" element={<AddEmployee />} />
        <Route path="/monthlyAttendance" element={<MonthlyAttendance />} />
      </Routes>
      {/* <AppInitializer/> */}
      {/* ✅ Show Chatbot on every page */}
      <Chatbot />
    </Router>
  );
}

export default App;
