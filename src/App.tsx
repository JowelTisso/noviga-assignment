import "./App.scss";
import SideNav from "./components/Drawer";
import Header from "./components/Header";
import AllRoutes from "./routes/AllRoutes";

function App() {
  return (
    <>
      <Header />
      <SideNav />
      <AllRoutes />
    </>
  );
}

export default App;
