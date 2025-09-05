"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Link from "next/link";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import useOffSetTop from "src/hooks/useOffSetTop";
import { APP_BAR_HEIGHT } from "src/constant";
import Logo from "../Logo";
import { usePathname, useRouter } from "next/navigation";
// Project-only actions are coordinated via window events to avoid provider coupling
import SearchBox from "../SearchBox";
import NetflixNavigationLink from "../NetflixNavigationLink";

const defaultPages = [
  { label: "Welcome", href: "/" },
  { label: "About", href: "/about" },
  { label: "Portfolio", href: "/stalker" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
];

const MainHeader = () => {
  const isOffset = useOffSetTop(APP_BAR_HEIGHT);
  const pathname = usePathname();
  const router = useRouter();
  const isProjects = pathname?.startsWith("/projects");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOverlayOpen, setMobileOverlayOpen] = React.useState(false);
  // Avoid project-specific hooks here; use events from header to page

  const pages = React.useMemo(() => {
    if (!isProjects) return defaultPages;
    return [
      { label: "About", href: "#about-modal" },
      { label: "Projects", href: "#projects" },
    ];
  }, [isProjects]);

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar
      sx={{
        // px: "4%",
        px: "60px",
        height: APP_BAR_HEIGHT,
        backgroundImage: "none",
        ...(isOffset
          ? {
              bgcolor: "primary.main",
              boxShadow: (theme) => theme.shadows[4],
            }
          : { boxShadow: 0, bgcolor: "transparent" }),
      }}
    >
      <Toolbar disableGutters>
        <Logo
          href={isProjects && !isMobile ? "/intro" : undefined}
          onLogoClick={isProjects && isMobile ? () => setMobileOverlayOpen(true) : undefined}
          sx={{ mr: { xs: 2, sm: 4 }, cursor: "pointer" }}
        />

        <Box sx={{ flexGrow: 1, display: { xs: isProjects ? "none" : "flex", md: "none" } }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
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
            sx={{
              display: { xs: "block", md: "none" },
            }}
          >
            {pages.map((page) => (
              <MenuItem                key={page.href}            // ✅ benzersiz key
                                       component={Link}           // ✅ Link olarak render et
                                       href={page.href === "#about-modal" ? "#" : page.href}           // ✅ hedef
                                       onClick={(e) => {
                                         handleCloseNavMenu();
                                         if (isProjects) {
                                           if (page.label === "About") {
                                             e.preventDefault();
                                             try { window.dispatchEvent(new Event('projects:about')); } catch {}
                                           } else if (page.label === "Projects") {
                                             const el = document.getElementById("projects-list") || document.getElementById("projects-root");
                                             try { window.dispatchEvent(new CustomEvent('projects:scroll', { detail: { id: 'projects-list' } })); } catch {}
                                           }
                                         }
                                       }}
              >
                  <Typography textAlign="center">{page.label}</Typography> /* ✅ metin */
              </MenuItem>
            ))}
          </Menu>
        </Box>
        <Typography
          variant="h5"
          noWrap
          component="a"
          href=""
          sx={{
            mr: 2,
            display: { xs: isProjects ? "none" : "flex", md: "none" },
            flexGrow: 1,
            fontWeight: 700,
            color: "inherit",
            textDecoration: "none",
          }}
        >
          Netflix
        </Typography>
        <Stack
          direction="row"
          spacing={3}
          sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
        >
          {pages.map((page) => (
            <NetflixNavigationLink
              key={page.href}
              href={page.href === "#about-modal" ? "#" : page.href}
              variant="subtitle1"
              onClick={(e) => {
                if (!isProjects) {
                  handleCloseNavMenu();
                  return;
                }
                if (page.label === "About") {
                  e.preventDefault();
                  try { window.dispatchEvent(new Event('projects:about')); } catch {}
                  return;
                }
                if (page.label === "Projects") {
                  e.preventDefault();
                  const el = document.getElementById("projects-list") || document.getElementById("projects-root");
                  try { window.dispatchEvent(new CustomEvent('projects:scroll', { detail: { id: 'projects-list' } })); } catch {}
                  return;
                }
                handleCloseNavMenu();
              }}
            >
              {page.label}
            </NetflixNavigationLink>
          ))}
        </Stack>

        <Box sx={{ flexGrow: 0, display: "flex", gap: 2 }}>
          <SearchBox />
          <Tooltip title={isProjects ? "Accounts" : "Open settings"}>
            <IconButton onClick={(e) => { if (isProjects) { router.push('/accounts'); } else { handleOpenUserMenu(e as any); } }} sx={{ p: 0 }}>
              <Avatar alt="user_avatar" src="/avatar.png" variant="rounded" />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            id="avatar-menu"
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
            {["Account", "Logout"].map((setting) => (
              <MenuItem key={setting} onClick={handleCloseUserMenu}>
                <Typography textAlign="center">{setting}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>

      {isProjects && isMobile && mobileOverlayOpen && (
        <Box
          onClick={() => setMobileOverlayOpen(false)}
          sx={{ position: 'fixed', inset: 0, zIndex: 2000,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.85), rgba(0,0,0,0.95))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2,
          }}
        >
          <Stack spacing={2} sx={{ width: '100%', maxWidth: 320 }} onClick={(e)=>e.stopPropagation()}>
            {pages.map((page) => (
              <NetflixNavigationLink
                key={`mobile-${page.href}`}
                href="#"
                variant="h6"
                onClick={(e)=>{
                  e.preventDefault();
                  setMobileOverlayOpen(false);
                  if (page.label === 'About') {
                    try { window.dispatchEvent(new Event('projects:about')); } catch {}
                  } else if (page.label === 'Projects') {
                    try { window.dispatchEvent(new CustomEvent('projects:scroll', { detail: { id: 'projects-list' } })); } catch {}
                  }
                }}
              >
                {page.label}
              </NetflixNavigationLink>
            ))}
          </Stack>
        </Box>
      )}

    </AppBar>
  );
};
export default MainHeader;
