import { useState } from 'react';
import {
    Box, Typography, Grid, Card, CardContent, Chip, Avatar, Stack, Divider,
    Button, Dialog, DialogTitle, DialogContent, DialogActions, Slider,
    TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import AssignmentIcon from '@mui/icons-material/Assignment';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { referees, currentReferee } from '../data/referees';
import { initialMatchRatings } from '../data/matchRatings';
import { tournaments } from '../data/tournaments';
import { teams } from '../data/teams';
import { players } from '../data/players';

function getRoundLabel(matchId) {
    if (matchId.startsWith('qf')) return 'Çeyrek Final';
    if (matchId.startsWith('sf')) return 'Yarı Final';
    if (matchId === 'f1') return 'Final';
    return 'Maç';
}

function getAssignedMatches(refereeId) {
    const matches = [];
    tournaments.forEach((t) => {
        const rounds = [
            ...(t.bracket.quarterFinals || []),
            ...(t.bracket.semiFinals || []),
            ...(t.bracket.final ? [t.bracket.final] : []),
        ];
        rounds.forEach((m) => {
            if (m.refereeId === refereeId) {
                matches.push({ ...m, tournamentId: t.id, tournamentName: t.name, round: getRoundLabel(m.id) });
            }
        });
    });
    return matches;
}

const ratingColor = (v) => {
    if (v >= 8) return { bg: 'rgba(0,230,118,0.15)', color: '#00E676' };
    if (v >= 6) return { bg: 'rgba(255,214,0,0.15)', color: '#FFD600' };
    return { bg: 'rgba(255,82,82,0.15)', color: '#FF5252' };
};

export default function RefereePanel() {
    const [matchRatings, setMatchRatings] = useState(initialMatchRatings);
    const [ratingModal, setRatingModal] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [tempRatings, setTempRatings] = useState({});

    const assignedMatches = getAssignedMatches(currentReferee.id);
    const completedMatches = assignedMatches.filter((m) => m.played);
    const pendingMatches = assignedMatches.filter((m) => !m.played);
    const ratedMatchIds = matchRatings.map((r) => r.matchId);
    const totalRatingsGiven = matchRatings.reduce((s, mr) => s + mr.ratings.length, 0);

    const openRatingModal = (match) => {
        setSelectedMatch(match);
        const existing = matchRatings.find((mr) => mr.matchId === match.id);
        if (existing) {
            const pre = {};
            existing.ratings.forEach((r) => { pre[r.playerId] = { rating: r.rating, comment: r.comment }; });
            setTempRatings(pre);
        } else {
            setTempRatings({});
        }
        setRatingModal(true);
    };

    const getMatchPlayers = (match) => {
        if (!match) return [];
        const t1 = teams.find((t) => t.id === match.team1Id);
        const t2 = teams.find((t) => t.id === match.team2Id);
        const ids = [...(t1?.playerIds || []), ...(t2?.playerIds || [])];
        return players.filter((p) => ids.includes(p.id));
    };

    const handleSave = () => {
        const newRatings = Object.entries(tempRatings).map(([pid, val]) => ({
            playerId: Number(pid),
            rating: val.rating ?? 7,
            comment: val.comment || '',
        }));
        setMatchRatings((prev) => {
            const exists = prev.find((mr) => mr.matchId === selectedMatch.id);
            if (exists) return prev.map((mr) => mr.matchId === selectedMatch.id ? { ...mr, ratings: newRatings } : mr);
            return [...prev, {
                id: prev.length + 1,
                matchId: selectedMatch.id,
                tournamentId: selectedMatch.tournamentId,
                refereeId: currentReferee.id,
                date: new Date().toISOString().split('T')[0],
                ratings: newRatings,
            }];
        });
        setRatingModal(false);
    };

    const matchPlayers = getMatchPlayers(selectedMatch);

    return (
        <Box>
            {/* ── Hakem Profil Kartı ── */}
            <Card sx={{
                mb: 3, p: 3,
                background: 'linear-gradient(135deg, rgba(255,214,0,0.07) 0%, rgba(68,138,255,0.04) 100%)',
                border: '1px solid rgba(255,214,0,0.18)',
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                    <Avatar
                        src={currentReferee.avatar}
                        sx={{ width: 76, height: 76, border: '3px solid #FFD600', flexShrink: 0 }}
                    />
                    <Box sx={{ flex: 1, minWidth: 180 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
                            <Typography variant="h5" fontWeight={800}>{currentReferee.name}</Typography>
                            <Chip label="🟨 Hakem" size="small"
                                sx={{ bgcolor: 'rgba(255,214,0,0.15)', color: '#FFD600', fontWeight: 700 }} />
                            <Chip label={currentReferee.licenseLevel} size="small" variant="outlined"
                                sx={{ color: '#FFD600', borderColor: 'rgba(255,214,0,0.35)', fontSize: '0.7rem' }} />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                            @{currentReferee.username} · {currentReferee.city} · {currentReferee.specialization}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 0.5 }}>
                            "{currentReferee.bio}"
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', px: 2 }}>
                        <Typography variant="h3" fontWeight={900} sx={{ color: '#FFD600', lineHeight: 1 }}>
                            {currentReferee.avgScore}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">Hakem Puanı</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', px: 2 }}>
                        <Typography variant="h3" fontWeight={900} sx={{ color: '#448AFF', lineHeight: 1 }}>
                            {currentReferee.matchesRefereed}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">Toplam Maç</Typography>
                    </Box>
                </Box>
            </Card>

            {/* ── Özet Kartlar ── */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {[
                    { label: 'Atanan Maçlar', value: assignedMatches.length, color: '#FFD600', icon: <AssignmentIcon /> },
                    { label: 'Yönetilen Maçlar', value: completedMatches.length, color: '#00E676', icon: <CheckCircleIcon /> },
                    { label: 'Bekleyen Maçlar', value: pendingMatches.length, color: '#FF9800', icon: <PendingActionsIcon /> },
                    { label: 'Verilen Rating', value: totalRatingsGiven, color: '#448AFF', icon: <StarIcon /> },
                ].map((s, i) => (
                    <Grid key={i} size={{ xs: 6, sm: 3 }}>
                        <Card sx={{ p: 2.5, textAlign: 'center', border: `1px solid ${s.color}22` }}>
                            <Box sx={{ color: s.color, mb: 0.5 }}>{s.icon}</Box>
                            <Typography variant="h4" fontWeight={800} sx={{ color: s.color }}>{s.value}</Typography>
                            <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* ── Atanan Maçlar + Hakem Listesi ── */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
                {/* Atanan Maçlar */}
                <Grid size={{ xs: 12, lg: 7 }}>
                    <Card sx={{ p: 3, height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <GavelIcon sx={{ color: '#FFD600' }} />
                            <Typography variant="h6" fontWeight={700}>Atanan Maçlar</Typography>
                            <Chip label={`${assignedMatches.length} maç`} size="small"
                                sx={{ ml: 'auto', bgcolor: 'rgba(255,214,0,0.1)', color: '#FFD600', fontWeight: 700 }} />
                        </Box>
                        <Stack spacing={1.5}>
                            {assignedMatches.map((match) => {
                                const team1 = teams.find((t) => t.id === match.team1Id);
                                const team2 = teams.find((t) => t.id === match.team2Id);
                                const isRated = ratedMatchIds.includes(match.id);
                                return (
                                    <Box key={match.id} sx={{
                                        p: 2, borderRadius: 2,
                                        border: `1px solid ${match.played ? 'rgba(255,255,255,0.07)' : 'rgba(255,152,0,0.2)'}`,
                                        bgcolor: match.played ? 'rgba(255,255,255,0.02)' : 'rgba(255,152,0,0.03)',
                                        display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap',
                                    }}>
                                        <Box sx={{ flex: 1, minWidth: 200 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                <Chip size="small" label={match.round}
                                                    sx={{ bgcolor: 'rgba(68,138,255,0.12)', color: '#448AFF', fontWeight: 700, height: 20, fontSize: '0.65rem' }} />
                                                <Typography variant="caption" color="text.secondary">
                                                    {match.tournamentName}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body1" fontWeight={700}>
                                                {team1 ? `${team1.logo} ${team1.name}` : '—'} vs {team2 ? `${team2.logo} ${team2.name}` : '—'}
                                            </Typography>
                                            {match.played && (
                                                <Typography variant="body2" color="text.secondary">
                                                    Skor: <strong style={{ color: '#00E676' }}>{match.score1} – {match.score2}</strong>
                                                    {match.penalty && <span style={{ color: '#FF9800' }}> (pen. {match.penalty})</span>}
                                                </Typography>
                                            )}
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                            {!match.played && (
                                                <Chip label="Bekliyor" size="small"
                                                    sx={{ bgcolor: 'rgba(255,152,0,0.12)', color: '#FF9800', fontWeight: 700 }} />
                                            )}
                                            {isRated && (
                                                <Chip label="Değerlendirildi ✓" size="small"
                                                    sx={{ bgcolor: 'rgba(0,230,118,0.12)', color: '#00E676', fontWeight: 700 }} />
                                            )}
                                            {match.played && (
                                                <Button
                                                    variant={isRated ? 'outlined' : 'contained'}
                                                    size="small"
                                                    onClick={() => openRatingModal(match)}
                                                    startIcon={<StarIcon sx={{ fontSize: 14 }} />}
                                                    sx={{
                                                        fontSize: '0.75rem', fontWeight: 700,
                                                        ...(isRated
                                                            ? { borderColor: 'rgba(255,214,0,0.4)', color: '#FFD600', '&:hover': { borderColor: '#FFD600', bgcolor: 'rgba(255,214,0,0.06)' } }
                                                            : { bgcolor: '#FFD600', color: '#000', '&:hover': { bgcolor: '#FFC107' } }
                                                        ),
                                                    }}
                                                >
                                                    {isRated ? 'Güncelle' : 'Değerlendir'}
                                                </Button>
                                            )}
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Stack>
                    </Card>
                </Grid>

                {/* Tüm Hakemler */}
                <Grid size={{ xs: 12, lg: 5 }}>
                    <Card sx={{ p: 3, height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <EmojiEventsIcon sx={{ color: '#448AFF' }} />
                            <Typography variant="h6" fontWeight={700}>Tüm Hakemler</Typography>
                        </Box>
                        <Stack spacing={1.5}>
                            {referees.map((ref) => (
                                <Box key={ref.id} sx={{
                                    display: 'flex', alignItems: 'center', gap: 2,
                                    p: 2, borderRadius: 2,
                                    bgcolor: ref.id === currentReferee.id ? 'rgba(255,214,0,0.05)' : 'rgba(255,255,255,0.02)',
                                    border: `1px solid ${ref.id === currentReferee.id ? 'rgba(255,214,0,0.2)' : 'rgba(255,255,255,0.06)'}`,
                                }}>
                                    <Avatar src={ref.avatar}
                                        sx={{ width: 44, height: 44, border: `2px solid ${ref.id === currentReferee.id ? '#FFD600' : 'rgba(255,255,255,0.1)'}` }} />
                                    <Box sx={{ flex: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="body2" fontWeight={700}>{ref.name}</Typography>
                                            {ref.id === currentReferee.id && (
                                                <Chip label="Sen" size="small"
                                                    sx={{ bgcolor: 'rgba(255,214,0,0.15)', color: '#FFD600', fontWeight: 700, height: 18, fontSize: '0.6rem' }} />
                                            )}
                                        </Box>
                                        <Typography variant="caption" color="text.secondary">{ref.licenseLevel}</Typography>
                                    </Box>
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Typography variant="body2" fontWeight={800} color="#FFD600">{ref.avgScore}</Typography>
                                        <Typography variant="caption" color="text.secondary">{ref.matchesRefereed} maç</Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(255,214,0,0.04)', border: '1px solid rgba(255,214,0,0.12)' }}>
                            <Typography variant="caption" color="#FFD600" fontWeight={700} display="block" sx={{ mb: 0.5 }}>
                                Lisans Seviyeleri
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">A Lisansı → Profesyonel turnuvalar</Typography>
                            <Typography variant="caption" color="text.secondary" display="block">B Lisansı → Bölgesel / yerel turnuvalar</Typography>
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            {/* ── Tamamlanan Değerlendirmeler ── */}
            <Card sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <StarIcon sx={{ color: '#FFD600' }} />
                    <Typography variant="h6" fontWeight={700}>Tamamlanan Değerlendirmeler</Typography>
                    <Chip label={`${totalRatingsGiven} oyuncu`} size="small"
                        sx={{ ml: 'auto', bgcolor: 'rgba(255,214,0,0.1)', color: '#FFD600', fontWeight: 700 }} />
                </Box>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.75rem' }}>Maç</TableCell>
                                <TableCell sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.75rem' }}>Oyuncu</TableCell>
                                <TableCell sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.75rem' }} align="center">Rating</TableCell>
                                <TableCell sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.75rem' }}>Yorum</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {matchRatings.flatMap((mr) => {
                                const match = assignedMatches.find((m) => m.id === mr.matchId);
                                return mr.ratings.map((r, ri) => {
                                    const player = players.find((p) => p.id === r.playerId);
                                    const rc = ratingColor(r.rating);
                                    return (
                                        <TableRow key={`${mr.matchId}-${r.playerId}`}
                                            sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                                            {ri === 0 && (
                                                <TableCell rowSpan={mr.ratings.length} sx={{ verticalAlign: 'top', pt: 1.5 }}>
                                                    <Typography variant="caption" fontWeight={700} display="block">
                                                        {match?.round || mr.matchId}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {match?.tournamentName || ''}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" display="block">
                                                        {mr.date}
                                                    </Typography>
                                                </TableCell>
                                            )}
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Avatar src={player?.avatar} sx={{ width: 26, height: 26 }} />
                                                    <Box>
                                                        <Typography variant="caption" fontWeight={600} display="block">
                                                            {player?.name}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                                                            {player?.position}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip label={r.rating} size="small"
                                                    sx={{ fontWeight: 900, minWidth: 36, bgcolor: rc.bg, color: rc.color }} />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="caption" color="text.secondary">
                                                    {r.comment || '—'}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    );
                                });
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            {/* ── Rating Modal ── */}
            <Dialog
                open={ratingModal}
                onClose={() => setRatingModal(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { bgcolor: '#111827', border: '1px solid rgba(255,255,255,0.1)' } }}
            >
                <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
                    Oyuncu Değerlendirmesi
                    {selectedMatch && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 400 }}>
                            {selectedMatch.round} · {selectedMatch.tournamentName}
                        </Typography>
                    )}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ pt: 1 }}>
                        {matchPlayers.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">Bu maça atanmış oyuncu bulunamadı.</Typography>
                        ) : matchPlayers.map((player) => (
                            <Box key={player.id} sx={{
                                p: 2, borderRadius: 2,
                                border: '1px solid rgba(255,255,255,0.08)',
                                bgcolor: 'rgba(255,255,255,0.02)',
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                                    <Avatar src={player.avatar} sx={{ width: 38, height: 38 }} />
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body2" fontWeight={700}>{player.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">{player.position}</Typography>
                                    </Box>
                                    <Chip
                                        label={`${tempRatings[player.id]?.rating ?? 7}/10`}
                                        size="small"
                                        sx={{ fontWeight: 900, bgcolor: 'rgba(255,214,0,0.15)', color: '#FFD600', minWidth: 52 }}
                                    />
                                </Box>
                                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                                    Performans Puanı
                                </Typography>
                                <Slider
                                    value={tempRatings[player.id]?.rating ?? 7}
                                    onChange={(_, v) => setTempRatings((p) => ({ ...p, [player.id]: { ...p[player.id], rating: v } }))}
                                    min={1} max={10} step={1} marks
                                    sx={{
                                        color: '#FFD600', mb: 1.5,
                                        '& .MuiSlider-mark': { bgcolor: 'rgba(255,255,255,0.2)' },
                                        '& .MuiSlider-markActive': { bgcolor: '#FFD600' },
                                    }}
                                />
                                <TextField
                                    size="small" fullWidth placeholder="Kısa yorum (isteğe bağlı)"
                                    value={tempRatings[player.id]?.comment || ''}
                                    onChange={(e) => setTempRatings((p) => ({ ...p, [player.id]: { ...p[player.id], comment: e.target.value } }))}
                                    sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' } } }}
                                />
                            </Box>
                        ))}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                    <Button onClick={() => setRatingModal(false)}
                        sx={{ color: 'text.secondary', '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' } }}>
                        İptal
                    </Button>
                    <Button variant="contained" onClick={handleSave} startIcon={<StarIcon sx={{ fontSize: 16 }} />}
                        sx={{ bgcolor: '#FFD600', color: '#000', fontWeight: 700, '&:hover': { bgcolor: '#FFC107' } }}>
                        Kaydet
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
