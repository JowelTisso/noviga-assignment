import "./App.scss";
import SideNav from "./components/Drawer";
import Header from "./components/Header";
import AllRoutes from "./routes/AllRoutes";

function App() {
  return (
    <div>
      <Header />
      <SideNav />
      <AllRoutes />
    </div>
  );
}

export default App;
