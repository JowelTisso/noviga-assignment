import { useState } from "react";
import Drawer from "@mui/material/Drawer";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { TimelineOutlined, AreaChartOutlined } from "@mui/icons-material";
import "./Drawer.scss";

const menuList = [
  {
    id: 1,
    title: "Scatter Data",
    icon: TimelineOutlined,
  },
  {
    id: 2,
    title: "Tree Visualization",
    icon: AreaChartOutlined,
  },
];

const SideNav = () => {
  const [openDrawer, setOpenDrawer] = useState(true);

  const toggleDrawer = (action: boolean) => setOpenDrawer(action);
  return (
    <Drawer open={openDrawer} onClose={() => toggleDrawer(false)}>
      <Box sx={{ width: 250 }} role="drawer">
        <p className="nav-title">Noviga Automation</p>
        <List>
          {menuList.map((menu) => (
            <ListItem key={menu.id} disablePadding>
              <ListItemButton>
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
