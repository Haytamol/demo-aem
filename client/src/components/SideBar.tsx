import { Box, IconButton } from "@mui/material";
import { useState } from "react";
import { Sidebar, Menu, SubMenu, MenuItem } from "react-pro-sidebar";
import { FaBars, FaMoneyCheckDollar } from "react-icons/fa6";
import Logo from "../assets/logo.png";
import { sideBarData } from "./SideBarData";
import { Link } from "react-router-dom";

const SideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <Box
      sx={{
        zIndex: 2,
        backgroundColor: "#233044",
        "& .ps-sidebar-root": {
          borderColor: "#233044",
        },
        "& .ps-sidebar-container": {
          background: "transparent !important",
          color: "#e0e0e0",
        },
        ".ps-menu-button": {
          fontSize: "16px",
          backgroundColor: "#233044 !important",
        },
        ".ps-menu-button:hover": {
          backgroundColor: "#202C3F !important",
        },
        ".ps-menu-button:focus": {
          backgroundColor: "#202C3F !important ",
        },
      }}
    >
      <Sidebar collapsed={isCollapsed}>
        <Menu>
          <MenuItem
            rootStyles={{
              marginTop: 30,
              marginBottom: 60,
              padding: 0,
              ".ps-menu-button": {
                cursor: "auto !important",
              },
              ".ps-menu-button:hover": {
                backgroundColor: "transparent !important",
              },
            }}
          >
            {isCollapsed ? (
              <Box>
                <IconButton
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  sx={{ color: "#e0e0e0" }}
                >
                  <FaBars />
                </IconButton>
              </Box>
            ) : (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                  backgroundColor: "transparent",
                }}
              >
                <Box
                  component="img"
                  paddingTop={1.5}
                  sx={{
                    height: 80,
                    backgroundColor: "transparent",
                  }}
                  alt="Logo"
                  src={Logo}
                />
                <IconButton
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  sx={{ color: "#e0e0e0" }}
                >
                  <FaBars />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {sideBarData.map((item) =>
            item.level == 1 ? (
              <MenuItem
                icon={item.icon}
                component={<Link to={item.path} />}
                key={item.title}
              >
                {item.title}
              </MenuItem>
            ) : null
          )}

          <SubMenu label="Balance Sheets" icon={<FaMoneyCheckDollar />}>
            {sideBarData.map((item) =>
              item.level == 2 ? (
                <MenuItem component={<Link to={item.path} />} key={item.title}>
                  {item.title}
                </MenuItem>
              ) : null
            )}
          </SubMenu>
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default SideBar;
