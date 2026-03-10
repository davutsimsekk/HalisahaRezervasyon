import { Link } from 'react-router-dom';
import {
    Box, Container, Typography, Button, Grid, Card, CardContent,
    CardMedia, Chip, Stack, Avatar, AvatarGroup,
} from '@mui/material';
import StadiumIcon from '@mui/icons-material/Stadium';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { fields } from '../data/fields';
import { players } from '../data/players';
import { tournaments } from '../data/tournaments';
import { teams } from '../data/teams';

const stats = [
    { icon: <StadiumIcon sx={{ fontSize: 40 }} />, value: '150+', label: 'Halı Saha', color: '#00E676' },
    { icon: <PeopleIcon sx={{ fontSize: 40 }} />, value: '2,500+', label: 'Oyuncu', color: '#448AFF' },
    { icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />, value: '85', label: 'Turnuva', color: '#FFD600' },
    { icon: <TrendingUpIcon sx={{ fontSize: 40 }} />, value: '12K+', label: 'Maç', color: '#FF5252' },
];

export default function Home() {
    const topFields = fields.slice(0, 4);
    const topPlayers = players.sort((a, b) => b.rating - a.rating).slice(0, 5);
    const activeTournament = tournaments.find((t) => t.status === 'active');

    return (
        <Box>
            {/* Hero Section */}
            <Box
                sx={{
                    position: 'relative',
                    minHeight: '85vh',
                    display: 'flex',
                    alignItems: 'center',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background: 'url("https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1600") center/cover',
                        filter: 'brightness(0.2) saturate(1.3)',
                        zIndex: 0,
                    },
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(10,14,23,0.3) 0%, rgba(10,14,23,0.8) 60%, rgba(10,14,23,1) 100%)',
                        zIndex: 1,
                    },
                }}
            >
                {/* Floating orbs */}
                <Box sx={{
                    position: 'absolute', width: 400, height: 400, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(0,230,118,0.15) 0%, transparent 70%)',
                    top: -100, right: -100, zIndex: 1, animation: 'pulse 4s ease-in-out infinite',
                }} />
                <Box sx={{
                    position: 'absolute', width: 300, height: 300, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(68,138,255,0.12) 0%, transparent 70%)',
                    bottom: 50, left: -50, zIndex: 1, animation: 'pulse 5s ease-in-out infinite 1s',
                }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                    <Box sx={{ maxWidth: 700 }}>
                        <Chip
                            label="🏟️ Türkiye'nin #1 Halı Saha Platformu"
                            sx={{
                                mb: 3,
                                backgroundColor: 'rgba(0,230,118,0.1)',
                                color: 'primary.main',
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                border: '1px solid rgba(0,230,118,0.2)',
                                py: 2.5,
                            }}
                        />
                        <Typography
                            variant="h1"
                            sx={{
                                fontSize: { xs: '2.5rem', md: '4rem' },
                                fontWeight: 900,
                                lineHeight: 1.1,
                                mb: 3,
                            }}
                        >
                            Sahayı Bul,{' '}
                            <Box
                                component="span"
                                sx={{
                                    background: 'linear-gradient(135deg, #00E676, #448AFF)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Rezervasyon Yap
                            </Box>
                            , Maça Başla!
                        </Typography>
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{ mb: 4, fontWeight: 400, lineHeight: 1.6, maxWidth: 550 }}
                        >
                            Şehrindeki en iyi halı sahaları keşfet, takımını kur, turnuvalara katıl
                            ve futbol deneyimini bir üst seviyeye taşı.
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <Button
                                variant="contained"
                                size="large"
                                component={Link}
                                to="/fields"
                                endIcon={<ArrowForwardIcon />}
                                sx={{ px: 4, py: 1.5, fontSize: '1.05rem' }}
                            >
                                Saha Bul
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                component={Link}
                                to="/tournaments"
                                sx={{
                                    px: 4, py: 1.5, fontSize: '1.05rem',
                                    borderColor: 'rgba(255,255,255,0.2)',
                                    color: 'text.primary',
                                    '&:hover': { borderColor: 'primary.main', backgroundColor: 'rgba(0,230,118,0.05)' },
                                }}
                            >
                                Turnuvalara Katıl
                            </Button>
                        </Stack>
                    </Box>
                </Container>
            </Box>

            {/* Stats Section */}
            <Container maxWidth="lg" sx={{ mt: -8, position: 'relative', zIndex: 3 }}>
                <Grid container spacing={3}>
                    {stats.map((s, i) => (
                        <Grid size={{ xs: 6, md: 3 }} key={i}>
                            <Card sx={{
                                textAlign: 'center', py: 3,
                                background: `linear-gradient(135deg, rgba(17,24,39,0.9) 0%, rgba(17,24,39,0.95) 100%)`,
                                border: `1px solid ${s.color}22`,
                            }}>
                                <Box sx={{ color: s.color, mb: 1 }}>{s.icon}</Box>
                                <Typography variant="h4" fontWeight={800} sx={{ color: s.color }}>{s.value}</Typography>
                                <Typography variant="body2" color="text.secondary">{s.label}</Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Featured Fields */}
            <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box>
                        <Typography variant="h4" fontWeight={700}>Öne Çıkan Sahalar</Typography>
                        <Typography variant="body1" color="text.secondary">En popüler halı sahalar</Typography>
                    </Box>
                    <Button component={Link} to="/fields" endIcon={<ArrowForwardIcon />} color="primary">
                        Tümünü Gör
                    </Button>
                </Box>
                <Grid container spacing={3}>
                    {topFields.map((field) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={field.id}>
                            <Card
                                component={Link}
                                to={`/field/${field.id}`}
                                sx={{ textDecoration: 'none', display: 'block', height: '100%' }}
                            >
                                <CardMedia
                                    component="img"
                                    height="180"
                                    image={field.image}
                                    alt={field.name}
                                    sx={{ objectFit: 'cover' }}
                                />
                                <CardContent>
                                    <Typography variant="h6" fontWeight={700} gutterBottom noWrap>
                                        {field.name}
                                    </Typography>
                                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1 }}>
                                        <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {field.district}, {field.city}
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Chip
                                            icon={<StarIcon sx={{ fontSize: 16 }} />}
                                            label={field.rating}
                                            size="small"
                                            sx={{ backgroundColor: 'rgba(255,214,0,0.12)', color: '#FFD600', fontWeight: 700 }}
                                        />
                                        <Typography variant="body2" fontWeight={700} color="primary.main">
                                            {field.pricePerHour} ₺/saat
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Active Tournament Banner */}
            {activeTournament && (
                <Container maxWidth="lg" sx={{ my: 8 }}>
                    <Card
                        sx={{
                            background: 'linear-gradient(135deg, rgba(255,214,0,0.08) 0%, rgba(68,138,255,0.08) 100%)',
                            border: '1px solid rgba(255,214,0,0.15)',
                            p: { xs: 3, md: 5 },
                        }}
                    >
                        <Grid container spacing={4} alignItems="center">
                            <Grid size={{ xs: 12, md: 7 }}>
                                <Chip label="🔴 CANLI" sx={{ mb: 2, backgroundColor: 'rgba(255,82,82,0.15)', color: '#FF5252', fontWeight: 700 }} />
                                <Typography variant="h4" fontWeight={800} gutterBottom>
                                    {activeTournament.name}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                    {activeTournament.format} • Ödül: {activeTournament.prizePool}
                                </Typography>
                                <Button
                                    variant="contained"
                                    component={Link}
                                    to={`/tournament/${activeTournament.id}`}
                                    endIcon={<ArrowForwardIcon />}
                                >
                                    Turnuvayı İncele
                                </Button>
                            </Grid>
                            <Grid size={{ xs: 12, md: 5 }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <EmojiEventsIcon sx={{ fontSize: 100, color: '#FFD600', opacity: 0.6 }} />
                                </Box>
                            </Grid>
                        </Grid>
                    </Card>
                </Container>
            )}

            {/* Top Players */}
            <Container maxWidth="lg" sx={{ mb: 10 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box>
                        <Typography variant="h4" fontWeight={700}>En İyi Oyuncular</Typography>
                        <Typography variant="body1" color="text.secondary">En yüksek reytingli oyuncular</Typography>
                    </Box>
                    <Button component={Link} to="/players" endIcon={<ArrowForwardIcon />} color="primary">
                        Tümünü Gör
                    </Button>
                </Box>
                <Grid container spacing={3}>
                    {topPlayers.map((player, i) => (
                        <Grid size={{ xs: 12, sm: 6, md: 2.4 }} key={player.id}>
                            <Card
                                component={Link}
                                to={`/player/${player.id}`}
                                sx={{ textDecoration: 'none', textAlign: 'center', py: 3, px: 2 }}
                            >
                                <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                                    <Avatar
                                        src={player.avatar}
                                        sx={{ width: 80, height: 80, mx: 'auto', border: '3px solid', borderColor: i === 0 ? '#FFD600' : 'rgba(255,255,255,0.1)' }}
                                    />
                                    {i < 3 && (
                                        <Chip
                                            label={`#${i + 1}`}
                                            size="small"
                                            sx={{
                                                position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)',
                                                fontWeight: 800, fontSize: '0.7rem',
                                                backgroundColor: i === 0 ? '#FFD600' : i === 1 ? '#C0C0C0' : '#CD7F32',
                                                color: '#000',
                                            }}
                                        />
                                    )}
                                </Box>
                                <Typography variant="subtitle1" fontWeight={700} noWrap>{player.name}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{player.position}</Typography>
                                <Typography variant="h5" fontWeight={800} color="primary.main">{player.rating}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {player.goals} gol • {player.assists} asist
                                </Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Keyframes */}
            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
      `}</style>
        </Box>
    );
}
