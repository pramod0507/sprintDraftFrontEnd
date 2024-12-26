

import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import Dashboard from './pages/Dashboard.js';
import Landing from './pages/Landing.js';
import NoPageFound from './pages/NoPageFound.js'


function Router() {
  return (
    <div>
      
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />}/>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" Component={NoPageFound}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Router;
