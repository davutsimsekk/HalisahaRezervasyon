import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Box, Container, Typography, Grid, Card, CardContent, Chip, Stack,
    Avatar, Button, Tabs, Tab, Divider,
} from '@mui/material';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import HandshakeIcon from '@mui/icons-material/Handshake';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import StarIcon from '@mui/icons-material/Star';
import { playerRequests, availabilityPosts } from '../data/requests';
import { players } from '../data/players';
import { fields } from '../data/fields';

const positionColors = {
    'Forvet': '#FF5252',
    'Orta Saha': '#448AFF',
    'Defans': '#FFD600',
    'Kaleci': '#00E676',
};

export default function Requests() {
    const [tab, setTab] = useState(0);

    return (
        <Box sx={{ minHeight: '100vh', pt: 4, pb: 8 }}>
            <Container maxWidth="lg">
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h3" fontWeight={800} gutterBottom>İlanlar</Typography>
                    <Typography variant="h6" color="text.secondary" fontWeight={400}>
                        Oyuncu ara veya maç için müsaitliğini paylaş
                    </Typography>
                </Box>

                <Tabs
                    value={tab} onChange={(e, v) => setTab(v)}
                    sx={{
                        mb: 4,
                        '& .MuiTabs-indicator': { backgroundColor: 'primary.main', height: 3 },
                        '& .MuiTab-root': { fontWeight: 600, fontSize: '1rem' },
                    }}
                >
                    <Tab icon={<PersonSearchIcon />} iconPosition="start" label="Oyuncu Arıyorum" />
                    <Tab icon={<HandshakeIcon />} iconPosition="start" label="Maça Katılabilirim" />
                </Tabs>

                {/* Player Requests Tab */}
                {tab === 0 && (
                    <Grid container spacing={3}>
                        {playerRequests.map((req) => {
                            const user = players.find((p) => p.id === req.userId);
                            const field = fields.find((f) => f.id === req.fieldId);

                            return (
                                <Grid size={{ xs: 12, md: 6 }} key={req.id}>
                                    <Card sx={{ height: '100%' }}>
                                        <CardContent sx={{ p: 3 }}>
                                            {/* Header */}
                                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                                                <Stack direction="row" alignItems="center" spacing={1.5}>
                                                    <Avatar
                                                        src={user?.avatar}
                                                        component={Link}
                                                        to={`/player/${user?.id}`}
                                                        sx={{ width: 40, height: 40, cursor: 'pointer' }}
                                                    />
                                                    <Box>
                                                        <Typography
                                                            variant="subtitle2" fontWeight={700}
                                                            component={Link} to={`/player/${user?.id}`}
                                                            sx={{ color: 'text.primary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                                                        >
                                                            {user?.name}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary" display="block">
                                                            {req.createdAt}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                                <Chip
                                                    label={req.position}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: `${positionColors[req.position]}20`,
                                                        color: positionColors[req.position],
                                                        fontWeight: 700,
                                                    }}
                                                />
                                            </Stack>

                                            {/* Message */}
                                            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                                                {req.message}
                                            </Typography>

                                            {/* Details */}
                                            <Stack spacing={1} sx={{ mb: 2 }}>
                                                <Stack direction="row" alignItems="center" spacing={0.5} color="text.secondary">
                                                    <SportsSoccerIcon sx={{ fontSize: 16 }} />
                                                    <Typography variant="body2">
                                                        {field?.name} — {req.city}
                                                    </Typography>
                                                </Stack>
                                                <Stack direction="row" spacing={2}>
                                                    <Stack direction="row" alignItems="center" spacing={0.5} color="text.secondary">
                                                        <CalendarMonthIcon sx={{ fontSize: 16 }} />
                                                        <Typography variant="body2">{req.date}</Typography>
                                                    </Stack>
                                                    <Stack direction="row" alignItems="center" spacing={0.5} color="text.secondary">
                                                        <AccessTimeIcon sx={{ fontSize: 16 }} />
                                                        <Typography variant="body2">{req.hour}:00</Typography>
                                                    </Stack>
                                                </Stack>
                                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                                    <PersonSearchIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                                                    <Typography variant="body2" color="primary.main" fontWeight={600}>
                                                        {req.playersNeeded} oyuncu aranıyor
                                                    </Typography>
                                                </Stack>
                                            </Stack>

                                            {/* Responses */}
                                            {req.responses.length > 0 && (
                                                <>
                                                    <Divider sx={{ my: 1.5 }} />
                                                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                                        {req.responses.length} yanıt
                                                    </Typography>
                                                    <Stack spacing={1}>
                                                        {req.responses.map((r, i) => {
                                                            const respUser = players.find((p) => p.id === r.userId);
                                                            return (
                                                                <Stack key={i} direction="row" spacing={1} alignItems="flex-start"
                                                                    sx={{ p: 1.5, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.02)' }}
                                                                >
                                                                    <Avatar src={respUser?.avatar} sx={{ width: 28, height: 28 }} />
                                                                    <Box>
                                                                        <Typography variant="caption" fontWeight={700}>{respUser?.name}</Typography>
                                                                        <Typography variant="body2" color="text.secondary">{r.message}</Typography>
                                                                    </Box>
                                                                </Stack>
                                                            );
                                                        })}
                                                    </Stack>
                                                </>
                                            )}

                                            <Button
                                                variant="outlined"
                                                fullWidth
                                                sx={{ mt: 2, borderColor: 'rgba(255,255,255,0.1)', '&:hover': { borderColor: 'primary.main' } }}
                                            >
                                                Başvur
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}

                {/* Availability Tab */}
                {tab === 1 && (
                    <Grid container spacing={3}>
                        {availabilityPosts.map((post) => {
                            const user = players.find((p) => p.id === post.userId);

                            return (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
                                    <Card sx={{ height: '100%' }}>
                                        <CardContent sx={{ p: 3 }}>
                                            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                                                <Avatar
                                                    src={user?.avatar}
                                                    component={Link}
                                                    to={`/player/${user?.id}`}
                                                    sx={{ width: 48, height: 48, cursor: 'pointer', border: '2px solid', borderColor: positionColors[post.position] }}
                                                />
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography
                                                        variant="subtitle1" fontWeight={700}
                                                        component={Link} to={`/player/${user?.id}`}
                                                        sx={{ color: 'text.primary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                                                    >
                                                        {user?.name}
                                                    </Typography>
                                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                                        <Chip
                                                            label={post.position} size="small"
                                                            sx={{ backgroundColor: `${positionColors[post.position]}20`, color: positionColors[post.position], fontWeight: 600, fontSize: '0.7rem', height: 20 }}
                                                        />
                                                        <Stack direction="row" alignItems="center" spacing={0.3}>
                                                            <StarIcon sx={{ fontSize: 14, color: '#FFD600' }} />
                                                            <Typography variant="caption" fontWeight={700}>{post.rating}</Typography>
                                                        </Stack>
                                                    </Stack>
                                                </Box>
                                            </Stack>

                                            <Typography variant="body2" sx={{ mb: 2 }}>{post.message}</Typography>

                                            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1 }} color="text.secondary">
                                                <LocationOnIcon sx={{ fontSize: 16 }} />
                                                <Typography variant="body2">{post.city}</Typography>
                                            </Stack>

                                            <Box sx={{ mb: 1.5 }}>
                                                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>Müsait Günler</Typography>
                                                <Stack direction="row" flexWrap="wrap" gap={0.5}>
                                                    {post.dates.map((d) => (
                                                        <Chip key={d} label={d} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                                                    ))}
                                                </Stack>
                                            </Box>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>Müsait Saatler</Typography>
                                                <Stack direction="row" flexWrap="wrap" gap={0.5}>
                                                    {post.hours.map((h) => (
                                                        <Chip key={h} label={`${h}:00`} size="small" variant="outlined" sx={{ fontSize: '0.7rem', borderColor: 'rgba(0,230,118,0.3)', color: 'primary.main' }} />
                                                    ))}
                                                </Stack>
                                            </Box>

                                            <Button variant="contained" fullWidth size="small">
                                                İletişime Geç
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Container>
        </Box>
    );
}
