import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Box, Container, Typography, Grid, Card, CardContent, Chip, Stack,
    Avatar, TextField, MenuItem, InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { players } from '../data/players';
import { cities } from '../data/fields';

const positions = ['Forvet', 'Orta Saha', 'Defans', 'Kaleci'];

export default function Players() {
    const [search, setSearch] = useState('');
    const [posFilter, setPosFilter] = useState('');
    const [cityFilter, setCityFilter] = useState('');
    const [sortBy, setSortBy] = useState('rating');

    const filtered = players
        .filter((p) => {
            const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
            const matchPos = !posFilter || p.position === posFilter;
            const matchCity = !cityFilter || p.city === cityFilter;
            return matchSearch && matchPos && matchCity;
        })
        .sort((a, b) => {
            if (sortBy === 'rating') return b.rating - a.rating;
            if (sortBy === 'goals') return b.goals - a.goals;
            if (sortBy === 'assists') return b.assists - a.assists;
            if (sortBy === 'matches') return b.matchesPlayed - a.matchesPlayed;
            return 0;
        });

    const positionColors = {
        'Forvet': '#FF5252',
        'Orta Saha': '#448AFF',
        'Defans': '#FFD600',
        'Kaleci': '#00E676',
    };

    return (
        <Box sx={{ minHeight: '100vh', pt: 4, pb: 8 }}>
            <Container maxWidth="lg">
                <Box sx={{ mb: 5 }}>
                    <Typography variant="h3" fontWeight={800} gutterBottom>Oyuncular</Typography>
                    <Typography variant="h6" color="text.secondary" fontWeight={400}>
                        Tüm kayıtlı oyuncuları keşfet ve profillerini incele
                    </Typography>
                </Box>

                {/* Filters */}
                <Card sx={{ p: 3, mb: 4 }}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <TextField
                                fullWidth size="small" placeholder="Oyuncu ara..."
                                value={search} onChange={(e) => setSearch(e.target.value)}
                                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary' }} /></InputAdornment> }}
                            />
                        </Grid>
                        <Grid size={{ xs: 6, md: 3 }}>
                            <TextField select fullWidth size="small" label="Pozisyon" value={posFilter} onChange={(e) => setPosFilter(e.target.value)}>
                                <MenuItem value="">Tümü</MenuItem>
                                {positions.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 6, md: 3 }}>
                            <TextField select fullWidth size="small" label="Şehir" value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
                                <MenuItem value="">Tümü</MenuItem>
                                {cities.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <TextField select fullWidth size="small" label="Sıralama" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                <MenuItem value="rating">Rating</MenuItem>
                                <MenuItem value="goals">Gol</MenuItem>
                                <MenuItem value="assists">Asist</MenuItem>
                                <MenuItem value="matches">Maç Sayısı</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>
                </Card>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{filtered.length} oyuncu bulundu</Typography>

                <Grid container spacing={3}>
                    {filtered.map((player, i) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={player.id}>
                            <Card component={Link} to={`/player/${player.id}`} sx={{ textDecoration: 'none' }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                                        <Avatar src={player.avatar} sx={{ width: 64, height: 64, border: '3px solid', borderColor: positionColors[player.position] || '#fff' }} />
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" fontWeight={700}>{player.name}</Typography>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Chip
                                                    label={player.position} size="small"
                                                    sx={{ backgroundColor: `${positionColors[player.position]}20`, color: positionColors[player.position], fontWeight: 600, fontSize: '0.7rem' }}
                                                />
                                                <Stack direction="row" alignItems="center" spacing={0.3}>
                                                    <LocationOnIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                                                    <Typography variant="caption" color="text.secondary">{player.city}</Typography>
                                                </Stack>
                                            </Stack>
                                        </Box>
                                        <Box sx={{ textAlign: 'right' }}>
                                            <Typography variant="h4" fontWeight={800} color="primary.main">{player.rating}</Typography>
                                        </Box>
                                    </Stack>
                                    <Grid container spacing={1}>
                                        <Grid size={3} sx={{ textAlign: 'center' }}>
                                            <Typography variant="body1" fontWeight={800}>{player.matchesPlayed}</Typography>
                                            <Typography variant="caption" color="text.secondary">Maç</Typography>
                                        </Grid>
                                        <Grid size={3} sx={{ textAlign: 'center' }}>
                                            <Typography variant="body1" fontWeight={800} sx={{ color: '#FF5252' }}>{player.goals}</Typography>
                                            <Typography variant="caption" color="text.secondary">Gol</Typography>
                                        </Grid>
                                        <Grid size={3} sx={{ textAlign: 'center' }}>
                                            <Typography variant="body1" fontWeight={800} sx={{ color: '#448AFF' }}>{player.assists}</Typography>
                                            <Typography variant="caption" color="text.secondary">Asist</Typography>
                                        </Grid>
                                        <Grid size={3} sx={{ textAlign: 'center' }}>
                                            <Typography variant="body1" fontWeight={800} sx={{ color: '#00E676' }}>{player.wins}</Typography>
                                            <Typography variant="caption" color="text.secondary">Galibiyet</Typography>
                                        </Grid>
                                    </Grid>
                                    {player.badges.length > 0 && (
                                        <Stack direction="row" spacing={0.5} sx={{ mt: 2, flexWrap: 'wrap', gap: 0.5 }}>
                                            {player.badges.slice(0, 3).map((b) => (
                                                <Chip key={b} label={`🏅 ${b}`} size="small" variant="outlined" sx={{ fontSize: '0.7rem', borderColor: 'rgba(255,214,0,0.3)' }} />
                                            ))}
                                        </Stack>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
