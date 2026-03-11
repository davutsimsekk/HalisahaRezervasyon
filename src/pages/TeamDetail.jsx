import { useParams, Link } from 'react-router-dom';
import {
    Box, Container, Typography, Grid, Card, CardContent, Chip, Stack,
    Avatar, Divider, IconButton, LinearProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import { teams } from '../data/teams';
import { players } from '../data/players';

export default function TeamDetail() {
    const { id } = useParams();
    const team = teams.find((t) => t.id === Number(id));

    if (!team) {
        return (
            <Container sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h4">Takım bulunamadı</Typography>
            </Container>
        );
    }

    const teamPlayers = players.filter((p) => p.teamId === team.id);
    const totalGames = team.wins + team.losses + team.draws;
    const winRate = totalGames > 0 ? ((team.wins / totalGames) * 100).toFixed(0) : 0;
    const captain = players.find((p) => p.id === team.captain);

    return (
        <Box sx={{ minHeight: '100vh', pt: 4, pb: 8 }}>
            <Container maxWidth="lg">
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                    <IconButton component={Link} to="/teams" sx={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Box
                        sx={{
                            width: 72, height: 72, borderRadius: 3,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '2.5rem',
                            backgroundColor: `${team.color}15`,
                            border: `2px solid ${team.color}40`,
                        }}
                    >
                        {team.logo}
                    </Box>
                    <Box>
                        <Typography variant="h3" fontWeight={800}>{team.name}</Typography>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body1" color="text.secondary">{team.city}</Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary">Kuruluş: {team.founded}</Typography>
                        </Stack>
                    </Box>
                </Stack>

                <Grid container spacing={4}>
                    {/* Stats */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom>Takım İstatistikleri</Typography>
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid size={4} sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" fontWeight={800} sx={{ color: '#00E676' }}>{team.wins}</Typography>
                                    <Typography variant="caption" color="text.secondary">Galibiyet</Typography>
                                </Grid>
                                <Grid size={4} sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" fontWeight={800} sx={{ color: '#FFD600' }}>{team.draws}</Typography>
                                    <Typography variant="caption" color="text.secondary">Beraberlik</Typography>
                                </Grid>
                                <Grid size={4} sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" fontWeight={800} sx={{ color: '#FF5252' }}>{team.losses}</Typography>
                                    <Typography variant="caption" color="text.secondary">Mağlubiyet</Typography>
                                </Grid>
                            </Grid>
                            <Divider sx={{ my: 2 }} />
                            <Stack spacing={1.5}>
                                <Box>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary">Kazanma Oranı</Typography>
                                        <Typography variant="body2" fontWeight={700} color="primary.main">{winRate}%</Typography>
                                    </Stack>
                                    <LinearProgress
                                        variant="determinate" value={Number(winRate)}
                                        sx={{ height: 8, borderRadius: 4, mt: 0.5, backgroundColor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { background: `linear-gradient(90deg, ${team.color}, ${team.color}88)`, borderRadius: 4 } }}
                                    />
                                </Box>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">Atılan Gol</Typography>
                                    <Typography variant="body2" fontWeight={700}>{team.goalsScored}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">Yenilen Gol</Typography>
                                    <Typography variant="body2" fontWeight={700}>{team.goalsConceded}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">Averaj</Typography>
                                    <Typography variant="body2" fontWeight={700} color={team.goalsScored - team.goalsConceded > 0 ? 'primary.main' : 'error.main'}>
                                        {team.goalsScored - team.goalsConceded > 0 ? '+' : ''}{team.goalsScored - team.goalsConceded}
                                    </Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">Takım Rating</Typography>
                                    <Chip label={`⭐ ${team.rating}`} size="small" sx={{ fontWeight: 700 }} />
                                </Stack>
                            </Stack>
                        </Card>

                        {captain && (
                            <Card sx={{ p: 3, border: '1px solid rgba(255,214,0,0.2)' }}>
                                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, color: '#FFD600' }}>
                                    👑 Kaptan
                                </Typography>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Avatar src={captain.avatar} sx={{ width: 48, height: 48 }} />
                                    <Box>
                                        <Typography
                                            variant="body1" fontWeight={700}
                                            component={Link} to={`/player/${captain.id}`}
                                            sx={{ color: 'text.primary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                                        >
                                            {captain.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">{captain.position}</Typography>
                                    </Box>
                                </Stack>
                            </Card>
                        )}
                    </Grid>

                    {/* Roster */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>Kadro</Typography>
                        <Grid container spacing={2}>
                            {teamPlayers.map((player) => (
                                <Grid size={{ xs: 12, sm: 6 }} key={player.id}>
                                    <Card
                                        component={Link}
                                        to={`/player/${player.id}`}
                                        sx={{ textDecoration: 'none' }}
                                    >
                                        <CardContent sx={{ p: 2.5 }}>
                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                <Avatar src={player.avatar} sx={{ width: 56, height: 56, border: '2px solid', borderColor: `${team.color}60` }} />
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography variant="subtitle1" fontWeight={700}>{player.name}</Typography>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Chip label={player.position} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                                                        <Typography variant="body2" color="text.secondary">#{player.id}</Typography>
                                                    </Stack>
                                                </Box>
                                                <Box sx={{ textAlign: 'right' }}>
                                                    <Typography variant="h5" fontWeight={800} color="primary.main">{player.rating}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{player.goals}G {player.assists}A</Typography>
                                                </Box>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                            {teamPlayers.length === 0 && (
                                <Grid size={12}>
                                    <Card sx={{ p: 4, textAlign: 'center' }}>
                                        <Typography color="text.secondary">Henüz kadro bilgisi mevcut değil.</Typography>
                                    </Card>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
