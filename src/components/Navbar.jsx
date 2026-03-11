import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    AppBar, Toolbar, Typography, Button, IconButton, Box, Drawer,
    List, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar,
    useMediaQuery, useTheme, Container,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import StadiumIcon from '@mui/icons-material/Stadium';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupsIcon from '@mui/icons-material/Groups';
import PeopleIcon from '@mui/icons-material/People';
import ForumIcon from '@mui/icons-material/Forum';
import LoginIcon from '@mui/icons-material/Login';
import HomeIcon from '@mui/icons-material/Home';
<<<<<<< HEAD
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorefrontIcon from '@mui/icons-material/Storefront';
=======
>>>>>>> 0e3a58f3d1399030d223af36f916e784cdcb5005
import { currentUser } from '../data/players';

const navItems = [
    { label: 'Ana Sayfa', path: '/', icon: <HomeIcon /> },
    { label: 'Sahalar', path: '/fields', icon: <StadiumIcon /> },
    { label: 'Turnuvalar', path: '/tournaments', icon: <EmojiEventsIcon /> },
    { label: 'Takımlar', path: '/teams', icon: <GroupsIcon /> },
    { label: 'Oyuncular', path: '/players', icon: <PeopleIcon /> },
    { label: 'İlanlar', path: '/requests', icon: <ForumIcon /> },
<<<<<<< HEAD
    { label: 'Kiralama', path: '/rental', icon: <StorefrontIcon /> },
    { label: 'Kontrol Merkezi', path: '/owner-dashboard', icon: <DashboardIcon /> },
=======
>>>>>>> 0e3a58f3d1399030d223af36f916e784cdcb5005
];

export default function Navbar() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <>
            <AppBar
                position="sticky"
                sx={{
                    background: 'rgba(10, 14, 23, 0.85)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ gap: 1 }}>
                        {/* Logo */}
                        <SportsSoccerIcon sx={{ color: 'primary.main', fontSize: 32, mr: 1 }} />
                        <Typography
                            variant="h6"
                            component={Link}
                            to="/"
                            sx={{
                                fontWeight: 800,
                                background: 'linear-gradient(135deg, #00E676, #448AFF)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textDecoration: 'none',
                                mr: 4,
                                fontSize: { xs: '1rem', md: '1.25rem' },
                            }}
                        >
                            HalıSaha+
                        </Typography>

                        {/* Desktop Nav */}
                        {!isMobile && (
                            <Box sx={{ display: 'flex', gap: 0.5, flexGrow: 1 }}>
                                {navItems.map((item) => (
                                    <Button
                                        key={item.path}
                                        component={Link}
                                        to={item.path}
                                        startIcon={item.icon}
                                        sx={{
                                            color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                                            fontWeight: location.pathname === item.path ? 700 : 500,
                                            fontSize: '0.9rem',
                                            borderRadius: 2,
                                            px: 2,
                                            '&:hover': {
                                                color: 'primary.main',
                                                backgroundColor: 'rgba(0, 230, 118, 0.08)',
                                            },
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                ))}
                            </Box>
                        )}

                        <Box sx={{ flexGrow: isMobile ? 1 : 0 }} />

                        {/* User Avatar */}
                        <Button
                            component={Link}
                            to={`/player/${currentUser.id}`}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                textTransform: 'none',
                                color: 'text.primary',
                            }}
                        >
                            <Avatar
                                src={currentUser.avatar}
                                sx={{ width: 34, height: 34, border: '2px solid', borderColor: 'primary.main' }}
                            />
                            {!isMobile && (
                                <Typography variant="body2" fontWeight={600}>
                                    {currentUser.name}
                                </Typography>
                            )}
                        </Button>

                        {/* Mobile Menu */}
                        {isMobile && (
                            <IconButton
                                color="inherit"
                                onClick={() => setDrawerOpen(true)}
                                sx={{ ml: 1 }}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{
                    sx: {
                        background: 'rgba(10, 14, 23, 0.95)',
                        backdropFilter: 'blur(20px)',
                        width: 280,
                    },
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, mt: 1 }}>
                        <SportsSoccerIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                        <Typography variant="h6" fontWeight={800} color="primary.main">
                            HalıSaha+
                        </Typography>
                    </Box>
                    <List>
                        {navItems.map((item) => (
                            <ListItem key={item.path} disablePadding>
                                <ListItemButton
                                    component={Link}
                                    to={item.path}
                                    onClick={() => setDrawerOpen(false)}
                                    sx={{
                                        borderRadius: 2,
                                        mb: 0.5,
                                        color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                                        backgroundColor: location.pathname === item.path ? 'rgba(0,230,118,0.08)' : 'transparent',
                                    }}
                                >
                                    <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.label} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                        <ListItem disablePadding>
                            <ListItemButton
                                component={Link}
                                to="/login"
                                onClick={() => setDrawerOpen(false)}
                                sx={{ borderRadius: 2 }}
                            >
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    <LoginIcon />
                                </ListItemIcon>
                                <ListItemText primary="Giriş Yap" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
        </>
    );
}
