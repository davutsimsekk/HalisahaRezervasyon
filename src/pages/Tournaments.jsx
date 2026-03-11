import { Link } from 'react-router-dom';
import {
    Box, Container, Typography, Grid, Card, CardContent, Chip, Stack,
    Button, Avatar, AvatarGroup, LinearProgress,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { tournaments } from '../data/tournaments';
import { teams } from '../data/teams';
import { fields } from '../data/fields';

const statusColors = {
    active: { bg: 'rgba(255,82,82,0.12)', color: '#FF5252', label: '🔴 Devam Ediyor' },
    upcoming: { bg: 'rgba(68,138,255,0.12)', color: '#448AFF', label: '📅 Yaklaşan' },
    completed: { bg: 'rgba(0,230,118,0.12)', color: '#00E676', label: '✅ Tamamlandı' },
};

export default function Tournaments() {
    return (
        <Box sx={{ minHeight: '100vh', pt: 4, pb: 8 }}>
            <Container maxWidth="lg">
                <Box sx={{ mb: 5 }}>
                    <Typography variant="h3" fontWeight={800} gutterBottom>
                        Turnuvalar
                    </Typography>
                    <Typography variant="h6" color="text.secondary" fontWeight={400}>
                        Aktif turnuvaları takip et, yeni turnuvalara katıl
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {tournaments.map((t) => {
                        const field = fields.find((f) => f.id === t.fieldId);
                        const status = statusColors[t.status];
                        const totalMatches = (t.bracket.quarterFinals?.length || 0) +
                            (t.bracket.semiFinals?.length || 0) + 1;
                        const playedMatches = [
                            ...(t.bracket.quarterFinals || []),
                            ...(t.bracket.semiFinals || []),
                            t.bracket.final,
                        ].filter((m) => m && m.played).length;
                        const progress = (playedMatches / totalMatches) * 100;

                        return (
                            <Grid size={{ xs: 12, md: 6 }} key={t.id}>
                                <Card sx={{ height: '100%' }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                                            <Chip
                                                label={status.label}
                                                sx={{ backgroundColor: status.bg, color: status.color, fontWeight: 700 }}
                                            />
                                            <Chip label={t.prizePool} sx={{ fontWeight: 700, backgroundColor: 'rgba(255,214,0,0.1)', color: '#FFD600' }} />
                                        </Stack>

                                        <Typography variant="h5" fontWeight={800} gutterBottom>
                                            {t.name}
                                        </Typography>

                                        <Stack spacing={1} sx={{ mb: 2 }}>
                                            <Stack direction="row" alignItems="center" spacing={0.5} color="text.secondary">
                                                <LocationOnIcon sx={{ fontSize: 18 }} />
                                                <Typography variant="body2">{field?.name}, {t.city}</Typography>
                                            </Stack>
                                            <Stack direction="row" alignItems="center" spacing={0.5} color="text.secondary">
                                                <CalendarMonthIcon sx={{ fontSize: 18 }} />
                                                <Typography variant="body2">{t.startDate} — {t.endDate}</Typography>
                                            </Stack>
                                            <Stack direction="row" alignItems="center" spacing={0.5} color="text.secondary">
                                                <EmojiEventsIcon sx={{ fontSize: 18 }} />
                                                <Typography variant="body2">{t.format}</Typography>
                                            </Stack>
                                        </Stack>

                                        {/* Progress */}
                                        <Box sx={{ mb: 2 }}>
                                            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                                                <Typography variant="caption" color="text.secondary">İlerleme</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {playedMatches}/{totalMatches} maç
                                                </Typography>
                                            </Stack>
                                            <LinearProgress
                                                variant="determinate"
                                                value={progress}
                                                sx={{
                                                    height: 6, borderRadius: 3,
                                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                                    '& .MuiLinearProgress-bar': {
                                                        background: 'linear-gradient(90deg, #00E676, #448AFF)',
                                                        borderRadius: 3,
                                                    },
                                                }}
                                            />
                                        </Box>

                                        {/* Teams */}
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                                {t.teamIds.slice(0, 4).map((tid) => {
                                                    const team = teams.find((tm) => tm.id === tid);
                                                    return (
                                                        <Chip
                                                            key={tid}
                                                            label={`${team?.logo} ${team?.name}`}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ fontSize: '0.75rem' }}
                                                        />
                                                    );
                                                })}
                                                {t.teamIds.length > 4 && (
                                                    <Chip label={`+${t.teamIds.length - 4}`} size="small" variant="outlined" />
                                                )}
                                            </Stack>
                                        </Stack>

                                        <Button
                                            component={Link}
                                            to={`/tournament/${t.id}`}
                                            variant="outlined"
                                            fullWidth
                                            endIcon={<ArrowForwardIcon />}
                                            sx={{
                                                mt: 3,
                                                borderColor: 'rgba(255,255,255,0.1)',
                                                '&:hover': { borderColor: 'primary.main' },
                                            }}
                                        >
                                            Detayları Gör
                                        </Button>
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
