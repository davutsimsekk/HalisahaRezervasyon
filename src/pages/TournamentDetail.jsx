import { useParams, Link } from 'react-router-dom';
import {
    Box, Container, Typography, Grid, Card, CardContent, Chip, Stack,
    Avatar, Divider, IconButton, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import { tournaments } from '../data/tournaments';
import { teams } from '../data/teams';
import { players } from '../data/players';
import { fields } from '../data/fields';

function MatchCard({ match, round }) {
    if (!match) return null;
    const team1 = teams.find((t) => t.id === match.team1Id);
    const team2 = teams.find((t) => t.id === match.team2Id);

    return (
        <Card
            sx={{
                p: 2,
                border: match.played
                    ? '1px solid rgba(0,230,118,0.15)'
                    : '1px solid rgba(255,255,255,0.06)',
                minWidth: 260,
            }}
        >
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                {round}
            </Typography>
            {/* Team 1 */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                    py: 1,
                    px: 1.5,
                    borderRadius: 1,
                    backgroundColor: match.winnerId === match.team1Id ? 'rgba(0,230,118,0.08)' : 'transparent',
                }}
            >
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography fontSize="1.2rem">{team1?.logo || '?'}</Typography>
                    <Typography
                        variant="body2"
                        fontWeight={match.winnerId === match.team1Id ? 700 : 400}
                        sx={{ color: match.winnerId === match.team1Id ? 'primary.main' : 'text.primary' }}
                    >
                        {team1?.name || 'TBD'}
                    </Typography>
                </Stack>
                <Typography
                    variant="h6"
                    fontWeight={800}
                    sx={{ color: match.winnerId === match.team1Id ? 'primary.main' : 'text.secondary' }}
                >
                    {match.score1 ?? '-'}
                </Typography>
            </Stack>

            {/* Team 2 */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                    py: 1,
                    px: 1.5,
                    borderRadius: 1,
                    backgroundColor: match.winnerId === match.team2Id ? 'rgba(0,230,118,0.08)' : 'transparent',
                }}
            >
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography fontSize="1.2rem">{team2?.logo || '?'}</Typography>
                    <Typography
                        variant="body2"
                        fontWeight={match.winnerId === match.team2Id ? 700 : 400}
                        sx={{ color: match.winnerId === match.team2Id ? 'primary.main' : 'text.primary' }}
                    >
                        {team2?.name || 'TBD'}
                    </Typography>
                </Stack>
                <Typography
                    variant="h6"
                    fontWeight={800}
                    sx={{ color: match.winnerId === match.team2Id ? 'primary.main' : 'text.secondary' }}
                >
                    {match.score2 ?? '-'}
                </Typography>
            </Stack>

            {match.penalty && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', textAlign: 'center' }}>
                    Penaltılar: {match.penalty}
                </Typography>
            )}
            {!match.played && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
                    Henüz oynanmadı
                </Typography>
            )}
        </Card>
    );
}

export default function TournamentDetail() {
    const { id } = useParams();
    const tournament = tournaments.find((t) => t.id === Number(id));

    if (!tournament) {
        return (
            <Container sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h4">Turnuva bulunamadı</Typography>
            </Container>
        );
    }

    const field = fields.find((f) => f.id === tournament.fieldId);
    const { bracket } = tournament;

    return (
        <Box sx={{ minHeight: '100vh', pt: 4, pb: 8 }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                    <IconButton component={Link} to="/tournaments" sx={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Box>
                        <Typography variant="h3" fontWeight={800}>{tournament.name}</Typography>
                        <Typography variant="body1" color="text.secondary">
                            {field?.name} • {tournament.city} • {tournament.startDate} — {tournament.endDate}
                        </Typography>
                    </Box>
                </Stack>

                {/* Info Bar */}
                <Card sx={{ p: 3, mb: 5 }}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid size={{ xs: 6, sm: 3 }} sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">Format</Typography>
                            <Typography variant="body1" fontWeight={700}>{tournament.format}</Typography>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }} sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">Ödül</Typography>
                            <Typography variant="body1" fontWeight={700} color="warning.main">{tournament.prizePool}</Typography>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }} sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">Durum</Typography>
                            <Chip
                                label={tournament.status === 'active' ? 'Devam Ediyor' : tournament.status === 'completed' ? 'Tamamlandı' : 'Yaklaşan'}
                                size="small"
                                sx={{
                                    mt: 0.5,
                                    backgroundColor: tournament.status === 'active' ? 'rgba(255,82,82,0.12)' : 'rgba(0,230,118,0.12)',
                                    color: tournament.status === 'active' ? '#FF5252' : '#00E676',
                                    fontWeight: 700,
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }} sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">Takım Sayısı</Typography>
                            <Typography variant="body1" fontWeight={700}>{tournament.teamIds.length}</Typography>
                        </Grid>
                    </Grid>
                </Card>

                {/* Tournament Bracket */}
                <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
                    <EmojiEventsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Turnuva Tablosu
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        gap: 3,
                        overflowX: 'auto',
                        pb: 3,
                        alignItems: 'center',
                    }}
                >
                    {/* Quarter Finals */}
                    {bracket.quarterFinals && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 280 }}>
                            <Typography variant="subtitle2" fontWeight={700} textAlign="center" color="text.secondary" sx={{ mb: 1 }}>
                                Çeyrek Final
                            </Typography>
                            {bracket.quarterFinals.map((m) => (
                                <MatchCard key={m.id} match={m} round="Çeyrek Final" />
                            ))}
                        </Box>
                    )}

                    {/* Connector */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1 }}>
                        {[0, 1].map((i) => (
                            <Box key={i} sx={{ width: 40, height: 2, backgroundColor: 'rgba(255,255,255,0.1)' }} />
                        ))}
                    </Box>

                    {/* Semi Finals */}
                    {bracket.semiFinals && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 280 }}>
                            <Typography variant="subtitle2" fontWeight={700} textAlign="center" color="text.secondary" sx={{ mb: 1 }}>
                                Yarı Final
                            </Typography>
                            {bracket.semiFinals.map((m) => (
                                <MatchCard key={m.id} match={m} round="Yarı Final" />
                            ))}
                        </Box>
                    )}

                    {/* Connector */}
                    <Box sx={{ width: 40, height: 2, backgroundColor: 'rgba(255,255,255,0.1)' }} />

                    {/* Final */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 280 }}>
                        <Typography variant="subtitle2" fontWeight={700} textAlign="center" color="text.secondary" sx={{ mb: 1 }}>
                            Final
                        </Typography>
                        <MatchCard match={bracket.final} round="Final" />

                        {/* Winner */}
                        {bracket.final.winnerId && (
                            <Card sx={{ p: 2, textAlign: 'center', border: '1px solid rgba(255,214,0,0.3)', mt: 1 }}>
                                <EmojiEventsIcon sx={{ fontSize: 40, color: '#FFD600', mb: 1 }} />
                                <Typography variant="h6" fontWeight={800} color="warning.main">
                                    {teams.find((t) => t.id === bracket.final.winnerId)?.logo}{' '}
                                    {teams.find((t) => t.id === bracket.final.winnerId)?.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">Şampiyon 🏆</Typography>
                            </Card>
                        )}
                    </Box>
                </Box>

                {/* Top Scorers */}
                {tournament.topScorers.length > 0 && (
                    <Box sx={{ mt: 6 }}>
                        <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
                            <SportsSoccerIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Gol Krallığı
                        </Typography>
                        <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', backgroundImage: 'none' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>#</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Oyuncu</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Takım</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 700, color: 'text.secondary' }}>Gol</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tournament.topScorers.map((ts, i) => {
                                        const player = players.find((p) => p.id === ts.playerId);
                                        const team = teams.find((t) => t.id === player?.teamId);
                                        return (
                                            <TableRow key={ts.playerId} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.02)' } }}>
                                                <TableCell>
                                                    <Chip
                                                        label={i + 1}
                                                        size="small"
                                                        sx={{
                                                            fontWeight: 800,
                                                            backgroundColor: i === 0 ? 'rgba(255,214,0,0.15)' : 'rgba(255,255,255,0.05)',
                                                            color: i === 0 ? '#FFD600' : 'text.primary',
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Stack direction="row" alignItems="center" spacing={1.5}>
                                                        <Avatar src={player?.avatar} sx={{ width: 32, height: 32 }} />
                                                        <Typography
                                                            variant="body2"
                                                            fontWeight={600}
                                                            component={Link}
                                                            to={`/player/${player?.id}`}
                                                            sx={{ color: 'text.primary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                                                        >
                                                            {player?.name}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">{team?.logo} {team?.name}</Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body1" fontWeight={800} color="primary.main">{ts.goals}</Typography>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}
            </Container>
        </Box>
    );
}
