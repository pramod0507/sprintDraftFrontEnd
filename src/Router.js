

import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import Dashboard from './pages/Dashboard.js';
import Landing from './pages/Landing.js';


function Router() {
  return (
    <div>
      
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />}/>
          <Route path="/dashboard" element={<Dashboard />} />
           
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Router;
