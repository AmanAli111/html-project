import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";

function App() 
{
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
