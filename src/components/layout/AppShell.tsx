import {NavLink, Outlet} from "react-router-dom";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from "@mui/icons-material/Dashboard";
import SecurityIcon from '@mui/icons-material/Security';
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";

const drawerWidth = 240;

const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Vulnerabilities', icon: <SecurityIcon />, path: '/vulnerabilities' },
    { text: 'Compare', icon: <CompareArrowsIcon />, path: '/compare' },
];

export default function AppShell() {
    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            {/* Top bar */}
            <AppBar
                position="fixed"
                sx={{
                    width: `calc(100% - ${drawerWidth}px)`,
                    ml: `${drawerWidth}px`,
                    bgcolor: '#1976d2',
                }}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Security Vulnerability Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        bgcolor: '#2c3e50',
                        color: 'white',
                    },
                }}
            >
                <Toolbar sx={{ bgcolor: '#1976d2', justifyContent: 'center' }}>
                    <SecurityIcon sx={{ mr: 1, color: 'white' }} />
                    <Typography variant="h6" fontWeight="bold" color="white">
                        Kai Inc.
                    </Typography>
                </Toolbar>
                <List>
                    {navItems.map((item) => (
                        <ListItemButton
                            key={item.path}
                            component={NavLink}
                            to={item.path}
                            sx={{
                                color: 'white',
                                '&.active': {
                                    bgcolor: 'rgba(25, 118, 210, 0.3)',
                                },
                                '&.active:hover': {
                                    bgcolor: 'rgba(25, 118, 210, 0.4)',
                                },
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    ))}
                </List>
            </Drawer>

            {/* Main content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: 'background.default',
                    p: 3,
                    width: `calc(100% - ${drawerWidth}px)`,
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}
