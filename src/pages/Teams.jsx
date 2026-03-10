import { Link } from 'react-router-dom';
import {
    Box, Container, Typography, Grid, Card, CardContent, Chip, Stack,
    Avatar, AvatarGroup, LinearProgress,
} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { teams } from '../data/teams';
import { players } from '../data/players';

export default function Teams() {
    return (
        <Box sx={{ minHeight: '100vh', pt: 4, pb: 8 }}>
            <Container maxWidth="lg">
                <Box sx={{ mb: 5 }}>
                    <Typography variant="h3" fontWeight={800} gutterBottom>
                        Takımlar
                    </Typography>
                    <Typography variant="h6" color="text.secondary" fontWeight={400}>
                        Tüm takımları keşfet ve performanslarını incele
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {teams.map((team) => {
                        const totalGames = team.wins + team.losses + team.draws;
                        const winRate = totalGames > 0 ? ((team.wins / totalGames) * 100).toFixed(0) : 0;
                        const teamPlayers = players.filter((p) => p.teamId === team.id);

                        return (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={team.id}>
                                <Card
                                    component={Link}
                                    to={`/team/${team.id}`}
                                    sx={{ textDecoration: 'none', height: '100%' }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        {/* Header */}
                                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                                            <Box
                                                sx={{
                                                    width: 56, height: 56, borderRadius: 3,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '2rem',
                                                    backgroundColor: `${team.color}15`,
                                                    border: `2px solid ${team.color}40`,
                                                }}
                                            >
                                                {team.logo}
                                            </Box>
                                            <Box>
                                                <Typography variant="h6" fontWeight={700}>{team.name}</Typography>
                                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                                    <LocationOnIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                    <Typography variant="body2" color="text.secondary">{team.city}</Typography>
                                                </Stack>
                                            </Box>
                                        </Stack>

                                        {/* Stats */}
                                        <Grid container spacing={1} sx={{ mb: 2 }}>
                                            <Grid size={4} sx={{ textAlign: 'center' }}>
                                                <Typography variant="h6" fontWeight={800} sx={{ color: '#00E676' }}>{team.wins}</Typography>
                                                <Typography variant="caption" color="text.secondary">Galibiyet</Typography>
                                            </Grid>
                                            <Grid size={4} sx={{ textAlign: 'center' }}>
                                                <Typography variant="h6" fontWeight={800} sx={{ color: '#FFD600' }}>{team.draws}</Typography>
                                                <Typography variant="caption" color="text.secondary">Beraberlik</Typography>
                                            </Grid>
                                            <Grid size={4} sx={{ textAlign: 'center' }}>
                                                <Typography variant="h6" fontWeight={800} sx={{ color: '#FF5252' }}>{team.losses}</Typography>
                                                <Typography variant="caption" color="text.secondary">Mağlubiyet</Typography>
                                            </Grid>
                                        </Grid>

                                        {/* Win Rate */}
                                        <Box sx={{ mb: 2 }}>
                                            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                                                <Typography variant="caption" color="text.secondary">Kazanma Oranı</Typography>
                                                <Typography variant="caption" fontWeight={700} color="primary.main">{winRate}%</Typography>
                                            </Stack>
                                            <LinearProgress
                                                variant="determinate"
                                                value={Number(winRate)}
                                                sx={{
                                                    height: 6, borderRadius: 3,
                                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                                    '& .MuiLinearProgress-bar': {
                                                        background: `linear-gradient(90deg, ${team.color}, ${team.color}88)`,
                                                        borderRadius: 3,
                                                    },
                                                }}
                                            />
                                        </Box>

                                        {/* Goal Stats */}
                                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                                <SportsSoccerIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                                                <Typography variant="body2">{team.goalsScored} gol attı</Typography>
                                            </Stack>
                                            <Typography variant="body2" color="text.secondary">{team.goalsConceded} gol yedi</Typography>
                                        </Stack>

                                        {/* Players */}
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: '0.75rem' } }}>
                                                {teamPlayers.map((p) => (
                                                    <Avatar key={p.id} src={p.avatar} />
                                                ))}
                                            </AvatarGroup>
                                            <Chip label={`⭐ ${team.rating}`} size="small" sx={{ fontWeight: 700 }} />
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>
        </Box>
    );
}
