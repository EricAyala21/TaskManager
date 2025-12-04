import './App.css';
import {Login} from "./pages/Login";
import {ToDo} from "./pages/ToDo";
import { BrowserRouter as Router, Routes,Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />}/>
          <Route path="/to_do_list" element={<ToDo />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
