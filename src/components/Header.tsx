import { useDispatch } from "react-redux";
import "./Header.scss";
import { toggleDrawer } from "../reducers/mainSlice";
import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";

const headerTitle: { [id: string]: string } = {
  "/": "Scatter Data",
  "/tree": "Tree Visualization",
};

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <header className="header">
      <span
        className="btn-sidenav"
        onClick={() => dispatch(toggleDrawer(true))}
      >
        <Menu />
      </span>
      <p className="title">{headerTitle[pathname]}</p>
    </header>
  );
};

export default Header;
