import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import "./Drawer.scss";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { toggleDrawer } from "../reducers/mainSlice";
import { useNavigate } from "react-router-dom";
import { ChartArea, ChartSpline } from "lucide-react";

const menuList = [
  {
    id: 1,
    title: "Scatter Data",
    icon: ChartArea,
    path: "/",
  },
  {
    id: 2,
    title: "Tree Visualization",
    icon: ChartSpline,
    path: "/tree",
  },
];

const SideNav: React.FC = () => {
  const openDrawer = useSelector((state: RootState) => state.main.openDrawer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const clickHandler = (path: string) => {
    navigate(path);
    dispatch(toggleDrawer(false));
  };

  return (
    <Drawer open={openDrawer} onClose={() => dispatch(toggleDrawer(false))}>
      <Box sx={{ width: 250 }} role="drawer">
        <p className="nav-title">Noviga Automation</p>
        <List>
          {menuList.map((menu) => (
            <ListItem key={menu.id} disablePadding>
              <ListItemButton onClick={() => clickHandler(menu.path)}>
                <ListItemIcon>
                  <menu.icon />
                </ListItemIcon>
                <ListItemText primary={menu.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default SideNav;
