import { Outlet } from "react-router-dom";
import NavBar from "./components/ui/NavBar";

function App(): JSX.Element {

  return (
    <div className="container mx-auto p-3">
      <NavBar />
      <Outlet />
    </div>
  );
}

export default App;
