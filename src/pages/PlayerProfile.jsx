import { useParams, Link } from 'react-router-dom';
import {
    Box, Container, Typography, Grid, Card, CardContent, Chip, Stack,
    Avatar, Divider, IconButton, LinearProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { players } from '../data/players';
import { teams } from '../data/teams';

const positionColors = {
    'Forvet': '#FF5252',
    'Orta Saha': '#448AFF',
    'Defans': '#FFD600',
    'Kaleci': '#00E676',
};

function StatRow({ label, value, max, color }) {
    const pct = Math.min((value / max) * 100, 100);
    return (
        <Box sx={{ mb: 1.5 }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.3 }}>
                <Typography variant="body2" color="text.secondary">{label}</Typography>
                <Typography variant="body2" fontWeight={700}>{value}</Typography>
            </Stack>
            <LinearProgress
                variant="determinate" value={pct}
                sx={{
                    height: 6, borderRadius: 3,
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    '& .MuiLinearProgress-bar': { backgroundColor: color, borderRadius: 3 },
                }}
            />
        </Box>
    );
}

export default function PlayerProfile() {
    const { id } = useParams();
    const player = players.find((p) => p.id === Number(id));

    if (!player) {
        return (
            <Container sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h4">Oyuncu bulunamadı</Typography>
            </Container>
        );
    }

    const team = teams.find((t) => t.id === player.teamId);
    const totalGames = player.wins + player.losses + player.draws;
    const winRate = totalGames > 0 ? ((player.wins / totalGames) * 100).toFixed(0) : 0;

    return (
        <Box sx={{ minHeight: '100vh', pt: 4, pb: 8 }}>
            <Container maxWidth="lg">
                <IconButton component={Link} to="/players" sx={{ mb: 3, backgroundColor: 'rgba(255,255,255,0.05)' }}>
                    <ArrowBackIcon />
                </IconButton>

                <Grid container spacing={4}>
                    {/* Profile Card */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card sx={{ p: 4, textAlign: 'center', position: 'relative', overflow: 'visible' }}>
                            {/* Background accent */}
                            <Box sx={{
                                position: 'absolute', top: 0, left: 0, right: 0, height: 120,
                                background: `linear-gradient(135deg, ${positionColors[player.position]}30 0%, transparent 100%)`,
                                borderRadius: '12px 12px 0 0',
                            }} />

                            <Avatar
                                src={player.avatar}
                                sx={{
                                    width: 120, height: 120, mx: 'auto', mb: 2,
                                    border: '4px solid', borderColor: positionColors[player.position],
                                    position: 'relative', zIndex: 1, mt: 2,
                                }}
                            />
                            <Typography variant="h4" fontWeight={800}>{player.name}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>@{player.username}</Typography>
                            <Stack direction="row" justifyContent="center" spacing={1} sx={{ mb: 2 }}>
                                <Chip
                                    label={player.position} size="small"
                                    sx={{ backgroundColor: `${positionColors[player.position]}20`, color: positionColors[player.position], fontWeight: 700 }}
                                />
                                <Chip
                                    icon={<LocationOnIcon sx={{ fontSize: 14 }} />}
                                    label={player.city} size="small" variant="outlined"
                                />
                            </Stack>

                            <Box sx={{
                                py: 2, px: 3, borderRadius: 3, mb: 2,
                                background: 'linear-gradient(135deg, rgba(0,230,118,0.1) 0%, rgba(68,138,255,0.1) 100%)',
                            }}>
                                <Typography variant="h2" fontWeight={900} color="primary.main">{player.rating}</Typography>
                                <Typography variant="body2" color="text.secondary">Genel Rating</Typography>
                            </Box>

                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 2 }}>
                                "{player.bio}"
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            <Stack spacing={1}>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">Yaş</Typography>
                                    <Typography variant="body2" fontWeight={600}>{player.age}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">Ayak</Typography>
                                    <Typography variant="body2" fontWeight={600}>{player.foot}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">Katılım</Typography>
                                    <Typography variant="body2" fontWeight={600}>{player.joinDate}</Typography>
                                </Stack>
                                {team && (
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" color="text.secondary">Takım</Typography>
                                        <Chip
                                            label={`${team.logo} ${team.name}`} size="small"
                                            component={Link} to={`/team/${team.id}`}
                                            clickable
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </Stack>
                                )}
                            </Stack>

                            {/* Badges */}
                            {player.badges.length > 0 && (
                                <>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Rozetler</Typography>
                                    <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={1}>
                                        {player.badges.map((b) => (
                                            <Chip
                                                key={b} label={`🏅 ${b}`}
                                                sx={{ backgroundColor: 'rgba(255,214,0,0.08)', color: '#FFD600', fontWeight: 600, fontSize: '0.8rem' }}
                                            />
                                        ))}
                                    </Stack>
                                </>
                            )}
                        </Card>
                    </Grid>

                    {/* Stats */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        {/* Overview Cards */}
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid size={{ xs: 6, sm: 3 }}>
                                <Card sx={{ p: 2.5, textAlign: 'center', border: '1px solid rgba(255,82,82,0.15)' }}>
                                    <SportsSoccerIcon sx={{ color: '#FF5252', fontSize: 28, mb: 0.5 }} />
                                    <Typography variant="h4" fontWeight={800}>{player.goals}</Typography>
                                    <Typography variant="caption" color="text.secondary">Gol</Typography>
                                </Card>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                                <Card sx={{ p: 2.5, textAlign: 'center', border: '1px solid rgba(68,138,255,0.15)' }}>
                                    <StarBorderIcon sx={{ color: '#448AFF', fontSize: 28, mb: 0.5 }} />
                                    <Typography variant="h4" fontWeight={800}>{player.assists}</Typography>
                                    <Typography variant="caption" color="text.secondary">Asist</Typography>
                                </Card>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                                <Card sx={{ p: 2.5, textAlign: 'center', border: '1px solid rgba(0,230,118,0.15)' }}>
                                    <EmojiEventsIcon sx={{ color: '#00E676', fontSize: 28, mb: 0.5 }} />
                                    <Typography variant="h4" fontWeight={800}>{player.wins}</Typography>
                                    <Typography variant="caption" color="text.secondary">Galibiyet</Typography>
                                </Card>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                                <Card sx={{ p: 2.5, textAlign: 'center', border: '1px solid rgba(255,214,0,0.15)' }}>
                                    <CalendarMonthIcon sx={{ color: '#FFD600', fontSize: 28, mb: 0.5 }} />
                                    <Typography variant="h4" fontWeight={800}>{player.matchesPlayed}</Typography>
                                    <Typography variant="caption" color="text.secondary">Maç</Typography>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Detailed Stats */}
                        <Card sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Detaylı İstatistikler</Typography>
                            <Grid container spacing={4}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <StatRow label="Gol" value={player.goals} max={100} color="#FF5252" />
                                    <StatRow label="Asist" value={player.assists} max={80} color="#448AFF" />
                                    <StatRow label="Maç" value={player.matchesPlayed} max={200} color="#00E676" />
                                    <StatRow label="Clean Sheet" value={player.cleanSheets} max={70} color="#AB47BC" />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <StatRow label="Galibiyet" value={player.wins} max={120} color="#00E676" />
                                    <StatRow label="Mağlubiyet" value={player.losses} max={120} color="#FF5252" />
                                    <StatRow label="Beraberlik" value={player.draws} max={50} color="#FFD600" />
                                    <Box sx={{ mb: 1.5 }}>
                                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.3 }}>
                                            <Typography variant="body2" color="text.secondary">Kazanma Oranı</Typography>
                                            <Typography variant="body2" fontWeight={700} color="primary.main">{winRate}%</Typography>
                                        </Stack>
                                        <LinearProgress
                                            variant="determinate" value={Number(winRate)}
                                            sx={{
                                                height: 6, borderRadius: 3,
                                                backgroundColor: 'rgba(255,255,255,0.05)',
                                                '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #00E676, #448AFF)', borderRadius: 3 },
                                            }}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Card>

                        {/* Discipline Card */}
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Disiplin</Typography>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 6 }} sx={{ textAlign: 'center' }}>
                                    <Box sx={{
                                        width: 48, height: 64, borderRadius: 1,
                                        background: 'linear-gradient(135deg, #FFD600, #FFC107)',
                                        mx: 'auto', mb: 1,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <Typography variant="h5" fontWeight={900} color="#000">{player.yellowCards}</Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">Sarı Kart</Typography>
                                </Grid>
                                <Grid size={{ xs: 6 }} sx={{ textAlign: 'center' }}>
                                    <Box sx={{
                                        width: 48, height: 64, borderRadius: 1,
                                        background: 'linear-gradient(135deg, #FF5252, #D32F2F)',
                                        mx: 'auto', mb: 1,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <Typography variant="h5" fontWeight={900} color="#fff">{player.redCards}</Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">Kırmızı Kart</Typography>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
