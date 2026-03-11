import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#00E676',
            light: '#69F0AE',
            dark: '#00C853',
            contrastText: '#000',
        },
        secondary: {
            main: '#448AFF',
            light: '#82B1FF',
            dark: '#2962FF',
        },
        background: {
            default: '#0A0E17',
            paper: '#111827',
        },
        success: {
            main: '#00E676',
        },
        warning: {
            main: '#FFD600',
        },
        error: {
            main: '#FF5252',
        },
        text: {
            primary: '#F1F5F9',
            secondary: '#94A3B8',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 800,
            letterSpacing: '-0.02em',
        },
        h2: {
            fontWeight: 700,
            letterSpacing: '-0.01em',
        },
        h3: {
            fontWeight: 700,
        },
        h4: {
            fontWeight: 600,
        },
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
        button: {
            fontWeight: 600,
            textTransform: 'none',
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    padding: '10px 24px',
                    fontSize: '0.95rem',
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #00E676 0%, #00C853 100%)',
                    boxShadow: '0 4px 20px rgba(0, 230, 118, 0.3)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #69F0AE 0%, #00E676 100%)',
                        boxShadow: '0 6px 30px rgba(0, 230, 118, 0.4)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: 'rgba(17, 24, 39, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        border: '1px solid rgba(0, 230, 118, 0.2)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
    },
});

export default theme;
