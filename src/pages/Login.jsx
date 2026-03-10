import { useState } from 'react';
import {
    Box, Container, Typography, Card, TextField, Button, Stack,
    Tabs, Tab, Divider, InputAdornment, IconButton, Snackbar, Alert,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function Login() {
    const [tab, setTab] = useState(0);
    const [showPass, setShowPass] = useState(false);
    const [snackbar, setSnackbar] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSnackbar(true);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background: 'url("https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1600") center/cover',
                    filter: 'brightness(0.15)',
                    zIndex: 0,
                },
            }}
        >
            {/* Floating orbs */}
            <Box sx={{
                position: 'absolute', width: 300, height: 300, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0,230,118,0.1) 0%, transparent 70%)',
                top: '10%', right: '10%', zIndex: 1,
            }} />
            <Box sx={{
                position: 'absolute', width: 250, height: 250, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(68,138,255,0.08) 0%, transparent 70%)',
                bottom: '15%', left: '5%', zIndex: 1,
            }} />

            <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
                <Card
                    sx={{
                        p: { xs: 3, sm: 5 },
                        backgroundColor: 'rgba(17, 24, 39, 0.9)',
                        backdropFilter: 'blur(30px)',
                        border: '1px solid rgba(255,255,255,0.08)',
                    }}
                >
                    {/* Logo */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <SportsSoccerIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                        <Typography
                            variant="h4"
                            fontWeight={800}
                            sx={{
                                background: 'linear-gradient(135deg, #00E676, #448AFF)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            HalıSaha+
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Halı saha deneyimini bir üst seviyeye taşı
                        </Typography>
                    </Box>

                    <Tabs
                        value={tab}
                        onChange={(e, v) => setTab(v)}
                        variant="fullWidth"
                        sx={{
                            mb: 3,
                            '& .MuiTabs-indicator': { backgroundColor: 'primary.main' },
                            '& .MuiTab-root': { fontWeight: 600 },
                        }}
                    >
                        <Tab label="Giriş Yap" />
                        <Tab label="Kayıt Ol" />
                    </Tabs>

                    <Box component="form" onSubmit={handleSubmit}>
                        {tab === 1 && (
                            <TextField
                                fullWidth
                                label="Ad Soyad"
                                sx={{ mb: 2 }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: 'text.secondary' }} /></InputAdornment>,
                                }}
                            />
                        )}
                        <TextField
                            fullWidth
                            label="E-posta"
                            type="email"
                            sx={{ mb: 2 }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: 'text.secondary' }} /></InputAdornment>,
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Şifre"
                            type={showPass ? 'text' : 'password'}
                            sx={{ mb: 3 }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: 'text.secondary' }} /></InputAdornment>,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPass(!showPass)} edge="end" size="small">
                                            {showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button type="submit" variant="contained" fullWidth size="large" sx={{ py: 1.5, mb: 2 }}>
                            {tab === 0 ? 'Giriş Yap' : 'Kayıt Ol'}
                        </Button>

                        {tab === 0 && (
                            <Typography variant="body2" color="text.secondary" textAlign="center">
                                Şifreni mi unuttun?{' '}
                                <Typography component="span" variant="body2" color="primary.main" sx={{ cursor: 'pointer' }}>
                                    Sıfırla
                                </Typography>
                            </Typography>
                        )}
                    </Box>
                </Card>
            </Container>

            <Snackbar open={snackbar} autoHideDuration={3000} onClose={() => setSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert severity="success" variant="filled" onClose={() => setSnackbar(false)}>
                    {tab === 0 ? 'Başarıyla giriş yapıldı!' : 'Hesabınız oluşturuldu!'} 🎉
                </Alert>
            </Snackbar>
        </Box>
    );
}
