import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { TextField } from "@mui/material";
import { Link } from "react-router";

import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useLocation } from "react-router";

import { API_URL } from "../utils/constants";
import { isAdmin, isHanzi } from "../utils/functions";
import { toast } from "sonner";

const pages = [
  { name: "Home/主页", url: "/" },
  { name: "Rules/规则", url: "/rules" },
  { name: "About/关于", url: "/about" },
  { name: "All Hanzi/全部汉字", url: "/h/" },
  { name: "All Users/全部用户", url: "/u/" },
];

function Navbar() {
  const [cookies, setCookie, removeCookie] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { token = "" } = currentuser;
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");

  const [settings, setSettings] = useState([
    { name: "Log In/登录", url: "/login" },
    { name: "Sign Up/注册", url: "/signup" },
  ]);

  useEffect(() => {
    if (currentuser && currentuser._id) {
      setSettings([
        { name: "Profile", url: "/u/view/" + currentuser._id },
        { name: "Log Out", url: "/logout" },
      ]);
    }
  }, [location.pathname]);

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleSearch = () => {
    if (!search) {
      toast.error("Search input must not be empty.");
    } else if (!isHanzi(search) || Array.from(search).length !== 1) {
      toast.error("Search input can only consist of one hanzi.");
    } else {
      navigate("/h/" + search);
      setSearch("");
    }
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl" sx={{ backgroundColor: "white.main" }}>
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "blue.main",
              textDecoration: "none",
            }}
          >
            <img src="/hanzipedia logo.svg" height="48rem" />
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => {
                if (page.url === "/u/") {
                  if (isAdmin(currentuser)) {
                    return (
                      <MenuItem
                        key={page.url}
                        component={Link}
                        to={page.url}
                        onClick={handleCloseNavMenu}
                      >
                        <Typography
                          sx={{ textAlign: "center", color: "blue.main" }}
                        >
                          {page.name}
                        </Typography>
                      </MenuItem>
                    );
                  }
                } else {
                  return (
                    <MenuItem
                      key={page.url}
                      component={Link}
                      to={page.url}
                      onClick={handleCloseNavMenu}
                    >
                      <Typography
                        sx={{ textAlign: "center", color: "blue.main" }}
                      >
                        {page.name}
                      </Typography>
                    </MenuItem>
                  );
                }
              })}
              <Box
                sx={{
                  mr: 3,
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  mt: 1,
                }}
              >
                <TextField
                  id="outlined-basic"
                  label="Search"
                  variant="outlined"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{ mx: 2 }}
                />
                <Button
                  variant="contained"
                  size="medium"
                  onClick={handleSearch}
                >
                  Search / 搜索
                </Button>
              </Box>
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "blue.main",
              textDecoration: "none",
            }}
          >
            <img src="/hanzipedia logo.svg" height="48rem" />
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "space-between",
            }}
          >
            <Box display="flex">
              {pages.map((page) => {
                if (page.url === "/u/") {
                  if (isAdmin(currentuser)) {
                    return (
                      <Button
                        key={page.url}
                        onClick={handleCloseNavMenu}
                        sx={{ my: 2, color: "blue.main", display: "block" }}
                        component={Link}
                        to={page.url}
                      >
                        {page.name}
                      </Button>
                    );
                  }
                } else {
                  return (
                    <Button
                      key={page.url}
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, color: "blue.main", display: "block" }}
                      component={Link}
                      to={page.url}
                    >
                      {page.name}
                    </Button>
                  );
                }
              })}
            </Box>
            <Box
              sx={{
                mx: 2,
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
                py: 1,
              }}
            >
              <TextField
                id="outlined-basic"
                variant="outlined"
                placeholder="Search for a hanzi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ mr: 2 }}
              />
              <Button variant="contained" size="medium" onClick={handleSearch}>
                Search / 搜索
              </Button>
            </Box>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt={
                    currentuser && currentuser._id
                      ? currentuser.name
                      : "defaultpfp"
                  }
                  src={
                    currentuser && currentuser._id
                      ? currentuser.pfp
                        ? API_URL + currentuser.pfp
                        : "/placeholder_pfp.png"
                      : "/placeholder_pfp_loggedout.png"
                  }
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting.name}
                  onClick={handleCloseUserMenu}
                  component={Link}
                  to={setting.url}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    {setting.name}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
