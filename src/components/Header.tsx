import "./Header.scss";
import MenuIcon from "@mui/icons-material/Menu";

const Header = () => {
  return (
    <header className="header">
      <span className="btn-sidenav" onClick={() => {}}>
        <MenuIcon />
      </span>
      <p className="title">Scatter Data</p>
    </header>
  );
};

export default Header;
