import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, Grid, Card, CardContent, Chip, Stack,
    Avatar, Divider, IconButton, LinearProgress, Button, Tooltip,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    Snackbar, Alert, Badge,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useTeams, LOGO_OPTIONS, COLOR_OPTIONS } from '../context/TeamContext';

export default function TeamDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { teams, players, updateTeam, deleteTeam, addPlayerToTeam, removePlayerFromTeam, setCaptain } = useTeams();

    const team = teams.find((t) => t.id === Number(id));

    // ── Edit modu ──────────────────────────────────────────────────────────────
    const [editMode, setEditMode] = useState(false);
    const [editForm, setEditForm] = useState({});

    const startEdit = () => {
        setEditForm({ name: team.name, city: team.city, logo: team.logo, color: team.color, founded: team.founded });
        setEditMode(true);
    };
    const cancelEdit = () => setEditMode(false);
    const saveEdit = () => {
        if (!editForm.name.trim()) return;
        updateTeam(team.id, editForm);
        setEditMode(false);
    };

    // ── Silme ──────────────────────────────────────────────────────────────────
    const [deleteDialog, setDeleteDialog] = useState(false);
    const handleDelete = () => {
        deleteTeam(team.id);
        navigate('/teams');
    };

    // ── Oyuncu ekleme ──────────────────────────────────────────────────────────
    const [addDialog, setAddDialog] = useState(false);
    const [playerSearch, setPlayerSearch] = useState('');
    const [selectedToAdd, setSelectedToAdd] = useState([]);

    const availablePlayers = players.filter(
        (p) => !team?.playerIds.includes(p.id) &&
            (p.name.toLowerCase().includes(playerSearch.toLowerCase()) ||
             p.username.toLowerCase().includes(playerSearch.toLowerCase()))
    );

    const toggleSelectPlayer = (pid) => {
        setSelectedToAdd((prev) => prev.includes(pid) ? prev.filter((id) => id !== pid) : [...prev, pid]);
    };

    const handleAddPlayers = () => {
        selectedToAdd.forEach((pid) => addPlayerToTeam(pid, team.id));
        setAddDialog(false);
        setSelectedToAdd([]);
        setPlayerSearch('');
        showSnack(`${selectedToAdd.length} oyuncu kadroya eklendi`, 'success');
    };

    // ── Oyuncu çıkarma ─────────────────────────────────────────────────────────
    const [removeConfirm, setRemoveConfirm] = useState(null); // playerId
    const handleRemove = () => {
        const p = players.find((x) => x.id === removeConfirm);
        removePlayerFromTeam(removeConfirm, team.id);
        setRemoveConfirm(null);
        showSnack(`${p?.name} kadrodan çıkarıldı`, 'info');
    };

    // ── Kaptan ────────────────────────────────────────────────────────────────
    const handleSetCaptain = (pid) => {
        setCaptain(pid, team.id);
        const p = players.find((x) => x.id === pid);
        showSnack(`${p?.name} kaptan olarak atandı 👑`, 'success');
    };

    // ── Snackbar ──────────────────────────────────────────────────────────────
    const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });
    const showSnack = (msg, severity = 'success') => setSnack({ open: true, msg, severity });

    if (!team) {
        return (
            <Container sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h4">Takım bulunamadı</Typography>
                <Button component={Link} to="/teams" sx={{ mt: 2 }}>Takımlara Dön</Button>
            </Container>
        );
    }

    const teamPlayers = players.filter((p) => team.playerIds.includes(p.id));
    const totalGames = team.wins + team.losses + team.draws;
    const winRate = totalGames > 0 ? ((team.wins / totalGames) * 100).toFixed(0) : 0;
    const captain = players.find((p) => p.id === team.captain);

    const positionColors = { 'Forvet': '#FF5252', 'Orta Saha': '#448AFF', 'Defans': '#FFD600', 'Kaleci': '#00E676' };

    return (
        <Box sx={{ minHeight: '100vh', pt: 4, pb: 8 }}>
            <Container maxWidth="lg">
                {/* ── Header ── */}
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4, flexWrap: 'wrap', gap: 2 }}>
                    <IconButton component={Link} to="/teams" sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
                        <ArrowBackIcon />
                    </IconButton>

                    <Box sx={{
                        width: 72, height: 72, borderRadius: 3, flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2.5rem',
                        backgroundColor: `${team.color}15`,
                        border: `2px solid ${team.color}40`,
                    }}>
                        {team.logo}
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h3" fontWeight={800}>{team.name}</Typography>
                        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body1" color="text.secondary">{team.city}</Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary">Kuruluş: {team.founded}</Typography>
                            <Chip label={`${teamPlayers.length} oyuncu`} size="small"
                                sx={{ bgcolor: `${team.color}18`, color: team.color, fontWeight: 700, border: `1px solid ${team.color}40` }} />
                        </Stack>
                    </Box>

                    <Stack direction="row" spacing={1}>
                        <Button
                            startIcon={<EditIcon sx={{ fontSize: 16 }} />}
                            onClick={startEdit}
                            sx={{
                                borderColor: 'rgba(255,255,255,0.15)', color: 'text.secondary', fontWeight: 700,
                                border: '1px solid', '&:hover': { borderColor: '#448AFF', color: '#448AFF', bgcolor: 'rgba(68,138,255,0.06)' },
                            }}
                        >
                            Düzenle
                        </Button>
                        <IconButton
                            onClick={() => setDeleteDialog(true)}
                            sx={{ color: 'text.secondary', '&:hover': { color: '#FF5252', bgcolor: 'rgba(255,82,82,0.08)' } }}
                        >
                            <DeleteOutlineIcon />
                        </IconButton>
                    </Stack>
                </Stack>

                <Grid container spacing={4}>
                    {/* ── Sol: İstatistikler & Kaptan ── */}
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
                                    <LinearProgress variant="determinate" value={Number(winRate)}
                                        sx={{ height: 8, borderRadius: 4, mt: 0.5, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { background: `linear-gradient(90deg, ${team.color}, ${team.color}88)`, borderRadius: 4 } }}
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
                                    <Typography variant="body2" fontWeight={700} color={team.goalsScored - team.goalsConceded >= 0 ? 'primary.main' : 'error.main'}>
                                        {team.goalsScored - team.goalsConceded >= 0 ? '+' : ''}{team.goalsScored - team.goalsConceded}
                                    </Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">Takım Rating</Typography>
                                    <Chip label={`⭐ ${team.rating}`} size="small" sx={{ fontWeight: 700 }} />
                                </Stack>
                            </Stack>
                        </Card>

                        {/* Kaptan Kartı */}
                        <Card sx={{ p: 3, border: `1px solid ${captain ? 'rgba(255,214,0,0.2)' : 'rgba(255,255,255,0.06)'}` }}>
                            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, color: '#FFD600' }}>
                                👑 Kaptan
                            </Typography>
                            {captain ? (
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Avatar src={captain.avatar} sx={{ width: 48, height: 48 }} />
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body1" fontWeight={700}
                                            component={Link} to={`/player/${captain.id}`}
                                            sx={{ color: 'text.primary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                                            {captain.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">{captain.position}</Typography>
                                    </Box>
                                </Stack>
                            ) : (
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 1 }}>
                                    Kaptan atanmamış
                                </Typography>
                            )}
                        </Card>
                    </Grid>

                    {/* ── Sağ: Kadro Yönetimi ── */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2.5 }}>
                            <Typography variant="h5" fontWeight={700}>
                                Kadro
                                <Chip label={teamPlayers.length} size="small"
                                    sx={{ ml: 1.5, bgcolor: `${team.color}18`, color: team.color, fontWeight: 800 }} />
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<PersonAddIcon />}
                                onClick={() => setAddDialog(true)}
                                sx={{ bgcolor: '#00E676', color: '#000', fontWeight: 700, '&:hover': { bgcolor: '#69F0AE' } }}
                            >
                                Oyuncu Ekle
                            </Button>
                        </Stack>

                        <Grid container spacing={2}>
                            {teamPlayers.map((player) => {
                                const isCaptain = team.captain === player.id;
                                return (
                                    <Grid size={{ xs: 12, sm: 6 }} key={player.id}>
                                        <Card sx={{
                                            border: isCaptain ? '1px solid rgba(255,214,0,0.35)' : '1px solid rgba(255,255,255,0.06)',
                                            bgcolor: isCaptain ? 'rgba(255,214,0,0.03)' : 'inherit',
                                            transition: 'all 0.15s',
                                        }}>
                                            <CardContent sx={{ p: 2.5 }}>
                                                <Stack direction="row" alignItems="center" spacing={2}>
                                                    <Badge
                                                        badgeContent={isCaptain ? '👑' : null}
                                                        overlap="circular"
                                                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                                    >
                                                        <Avatar
                                                            src={player.avatar}
                                                            component={Link}
                                                            to={`/player/${player.id}`}
                                                            sx={{ width: 52, height: 52, border: '2px solid', borderColor: `${team.color}60`, cursor: 'pointer' }}
                                                        />
                                                    </Badge>
                                                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                                        <Typography variant="subtitle1" fontWeight={700} noWrap
                                                            component={Link} to={`/player/${player.id}`}
                                                            sx={{ textDecoration: 'none', color: 'text.primary', '&:hover': { color: 'primary.main' } }}>
                                                            {player.name}
                                                        </Typography>
                                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                                            <Chip label={player.position} size="small" variant="outlined"
                                                                sx={{ fontSize: '0.65rem', height: 20, color: positionColors[player.position], borderColor: `${positionColors[player.position]}50` }} />
                                                        </Stack>
                                                    </Box>
                                                    <Box sx={{ textAlign: 'right' }}>
                                                        <Typography variant="h6" fontWeight={800} color="primary.main">{player.rating}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{player.goals}G {player.assists}A</Typography>
                                                    </Box>
                                                </Stack>

                                                {/* Aksiyon Butonları */}
                                                <Stack direction="row" spacing={1} sx={{ mt: 2, pt: 1.5, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                                    {!isCaptain ? (
                                                        <Button
                                                            size="small" startIcon={<EmojiEventsIcon sx={{ fontSize: 14 }} />}
                                                            onClick={() => handleSetCaptain(player.id)}
                                                            sx={{ flex: 1, fontSize: '0.72rem', fontWeight: 700, color: '#FFD600', borderColor: 'rgba(255,214,0,0.3)', border: '1px solid', '&:hover': { bgcolor: 'rgba(255,214,0,0.06)', borderColor: '#FFD600' } }}
                                                        >
                                                            Kaptan Yap
                                                        </Button>
                                                    ) : (
                                                        <Button size="small" disabled
                                                            sx={{ flex: 1, fontSize: '0.72rem', fontWeight: 700, color: '#FFD600', opacity: 0.6 }}
                                                            startIcon={<EmojiEventsIcon sx={{ fontSize: 14 }} />}>
                                                            Kaptan
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="small"
                                                        startIcon={<PersonRemoveIcon sx={{ fontSize: 14 }} />}
                                                        onClick={() => setRemoveConfirm(player.id)}
                                                        sx={{ flex: 1, fontSize: '0.72rem', fontWeight: 700, color: '#FF5252', borderColor: 'rgba(255,82,82,0.3)', border: '1px solid', '&:hover': { bgcolor: 'rgba(255,82,82,0.06)', borderColor: '#FF5252' } }}
                                                    >
                                                        Çıkar
                                                    </Button>
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            })}

                            {teamPlayers.length === 0 && (
                                <Grid size={12}>
                                    <Card sx={{ p: 5, textAlign: 'center', border: '1px dashed rgba(255,255,255,0.12)', bgcolor: 'transparent' }}>
                                        <Typography variant="h2" sx={{ mb: 1 }}>👥</Typography>
                                        <Typography variant="h6" color="text.secondary" fontWeight={600}>Kadro boş</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            Oyuncu ekleyerek kadroyu oluşturun
                                        </Typography>
                                        <Button variant="contained" startIcon={<PersonAddIcon />}
                                            onClick={() => setAddDialog(true)}
                                            sx={{ bgcolor: '#00E676', color: '#000', fontWeight: 700, '&:hover': { bgcolor: '#69F0AE' } }}>
                                            Oyuncu Ekle
                                        </Button>
                                    </Card>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </Container>

            {/* ═══════════════════════════════════════════════════════════════════
                  Modallar
            ═══════════════════════════════════════════════════════════════════ */}

            {/* ── Takım Düzenleme Modalı ── */}
            <Dialog open={editMode} onClose={cancelEdit} maxWidth="sm" fullWidth
                PaperProps={{ sx: { bgcolor: '#111827', border: '1px solid rgba(255,255,255,0.1)' } }}>
                <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
                    <Stack direction="row" alignItems="center" gap={1}>
                        <EditIcon sx={{ color: '#448AFF' }} />
                        Takım Bilgilerini Düzenle
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ pt: 1 }}>
                        {/* Logo */}
                        <Box>
                            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>Logo</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {LOGO_OPTIONS.map((emoji) => (
                                    <Box key={emoji} onClick={() => setEditForm((p) => ({ ...p, logo: emoji }))}
                                        sx={{
                                            width: 40, height: 40, borderRadius: 2, fontSize: '1.4rem',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                            border: `2px solid ${editForm.logo === emoji ? '#448AFF' : 'rgba(255,255,255,0.1)'}`,
                                            bgcolor: editForm.logo === emoji ? 'rgba(68,138,255,0.1)' : 'rgba(255,255,255,0.03)',
                                            '&:hover': { borderColor: '#448AFF' },
                                        }}>
                                        {emoji}
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                        <TextField label="Takım Adı *" value={editForm.name || ''} fullWidth
                            onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                            sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' } } }} />

                        <TextField label="Şehir" value={editForm.city || ''} fullWidth
                            onChange={(e) => setEditForm((p) => ({ ...p, city: e.target.value }))}
                            sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' } } }} />

                        <TextField label="Kuruluş Tarihi" type="month" value={editForm.founded || ''} fullWidth
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) => setEditForm((p) => ({ ...p, founded: e.target.value }))}
                            sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' } } }} />

                        {/* Renk */}
                        <Box>
                            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>Takım Rengi</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {COLOR_OPTIONS.map((c) => (
                                    <Tooltip key={c} title={c}>
                                        <Box onClick={() => setEditForm((p) => ({ ...p, color: c }))}
                                            sx={{
                                                width: 34, height: 34, borderRadius: '50%', bgcolor: c, cursor: 'pointer',
                                                border: `3px solid ${editForm.color === c ? '#fff' : 'transparent'}`,
                                                transition: 'all 0.15s', transform: editForm.color === c ? 'scale(1.2)' : 'scale(1)',
                                                '&:hover': { transform: 'scale(1.15)' },
                                            }}
                                        />
                                    </Tooltip>
                                ))}
                            </Box>
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                    <Button onClick={cancelEdit} sx={{ color: 'text.secondary' }}>İptal</Button>
                    <Button variant="contained" onClick={saveEdit} startIcon={<CheckIcon />}
                        sx={{ bgcolor: '#448AFF', color: '#fff', fontWeight: 700, '&:hover': { bgcolor: '#5C9FFF' } }}>
                        Kaydet
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Oyuncu Ekleme Modalı ── */}
            <Dialog open={addDialog} onClose={() => { setAddDialog(false); setSelectedToAdd([]); setPlayerSearch(''); }}
                maxWidth="sm" fullWidth
                PaperProps={{ sx: { bgcolor: '#111827', border: '1px solid rgba(255,255,255,0.1)' } }}>
                <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Stack direction="row" alignItems="center" gap={1}>
                            <PersonAddIcon sx={{ color: '#00E676' }} />
                            Oyuncu Ekle
                        </Stack>
                        {selectedToAdd.length > 0 && (
                            <Chip label={`${selectedToAdd.length} seçildi`} size="small"
                                sx={{ bgcolor: 'rgba(0,230,118,0.15)', color: '#00E676', fontWeight: 700 }} />
                        )}
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        placeholder="Oyuncu ara..."
                        value={playerSearch}
                        onChange={(e) => setPlayerSearch(e.target.value)}
                        fullWidth size="small" sx={{ mb: 2, mt: 1, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' } } }}
                    />
                    <Stack spacing={1} sx={{ maxHeight: 380, overflowY: 'auto', pr: 0.5 }}>
                        {availablePlayers.length === 0 ? (
                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                                {playerSearch ? 'Oyuncu bulunamadı' : 'Eklenebilecek oyuncu kalmadı'}
                            </Typography>
                        ) : availablePlayers.map((player) => {
                            const isSelected = selectedToAdd.includes(player.id);
                            const currentTeam = teams.find((t) => t.id === player.teamId);
                            return (
                                <Box key={player.id} onClick={() => toggleSelectPlayer(player.id)}
                                    sx={{
                                        p: 1.5, borderRadius: 2, cursor: 'pointer', transition: 'all 0.12s',
                                        border: `1px solid ${isSelected ? 'rgba(0,230,118,0.4)' : 'rgba(255,255,255,0.07)'}`,
                                        bgcolor: isSelected ? 'rgba(0,230,118,0.08)' : 'rgba(255,255,255,0.02)',
                                        display: 'flex', alignItems: 'center', gap: 1.5,
                                        '&:hover': { borderColor: 'rgba(0,230,118,0.25)', bgcolor: 'rgba(0,230,118,0.04)' },
                                    }}>
                                    <Avatar src={player.avatar} sx={{ width: 40, height: 40, flexShrink: 0 }} />
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography variant="body2" fontWeight={700} noWrap>{player.name}</Typography>
                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                            <Typography variant="caption" color="text.secondary">{player.position}</Typography>
                                            {currentTeam && (
                                                <Chip label={`${currentTeam.logo} ${currentTeam.name}`} size="small"
                                                    sx={{ height: 16, fontSize: '0.6rem', bgcolor: 'rgba(255,152,0,0.12)', color: '#FF9800' }} />
                                            )}
                                        </Stack>
                                    </Box>
                                    <Stack alignItems="flex-end" sx={{ flexShrink: 0 }}>
                                        <Typography variant="body2" fontWeight={800} color="primary.main">{player.rating}</Typography>
                                        <Box sx={{
                                            width: 22, height: 22, borderRadius: '50%',
                                            border: `2px solid ${isSelected ? '#00E676' : 'rgba(255,255,255,0.2)'}`,
                                            bgcolor: isSelected ? '#00E676' : 'transparent',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            {isSelected && <CheckIcon sx={{ fontSize: 14, color: '#000' }} />}
                                        </Box>
                                    </Stack>
                                </Box>
                            );
                        })}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                    <Button onClick={() => { setAddDialog(false); setSelectedToAdd([]); setPlayerSearch(''); }}
                        sx={{ color: 'text.secondary' }}>
                        İptal
                    </Button>
                    <Button variant="contained" onClick={handleAddPlayers} disabled={selectedToAdd.length === 0}
                        startIcon={<PersonAddIcon />}
                        sx={{ bgcolor: '#00E676', color: '#000', fontWeight: 700, '&:hover': { bgcolor: '#69F0AE' }, '&:disabled': { opacity: 0.4 } }}>
                        {selectedToAdd.length > 0 ? `${selectedToAdd.length} Oyuncuyu Ekle` : 'Oyuncu Ekle'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Oyuncu Çıkarma Onayı ── */}
            <Dialog open={Boolean(removeConfirm)} onClose={() => setRemoveConfirm(null)} maxWidth="xs" fullWidth
                PaperProps={{ sx: { bgcolor: '#111827', border: '1px solid rgba(255,82,82,0.2)' } }}>
                <DialogTitle sx={{ fontWeight: 800, color: '#FF5252' }}>Oyuncuyu Çıkar</DialogTitle>
                <DialogContent>
                    {removeConfirm && (() => {
                        const p = players.find((x) => x.id === removeConfirm);
                        return (
                            <Stack direction="row" alignItems="center" gap={2} sx={{ py: 1 }}>
                                <Avatar src={p?.avatar} sx={{ width: 48, height: 48 }} />
                                <Box>
                                    <Typography fontWeight={700}>{p?.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {team.name} kadrosundan çıkarılacak
                                    </Typography>
                                </Box>
                            </Stack>
                        );
                    })()}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                    <Button onClick={() => setRemoveConfirm(null)} sx={{ color: 'text.secondary' }}>İptal</Button>
                    <Button variant="contained" onClick={handleRemove} startIcon={<PersonRemoveIcon />}
                        sx={{ bgcolor: '#FF5252', color: '#fff', fontWeight: 700, '&:hover': { bgcolor: '#FF7070' } }}>
                        Çıkar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Takım Silme Onayı ── */}
            <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} maxWidth="xs" fullWidth
                PaperProps={{ sx: { bgcolor: '#111827', border: '1px solid rgba(255,82,82,0.2)' } }}>
                <DialogTitle sx={{ fontWeight: 800, color: '#FF5252' }}>
                    <Stack direction="row" alignItems="center" gap={1}>
                        <DeleteOutlineIcon />
                        Takımı Sil
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong style={{ color: team.color }}>{team.logo} {team.name}</strong> takımını silmek istediğinize emin misiniz?
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {teamPlayers.length > 0 && `${teamPlayers.length} oyuncu kadrodan çıkarılacak. `}
                        Bu işlem geri alınamaz.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                    <Button onClick={() => setDeleteDialog(false)} sx={{ color: 'text.secondary' }}>İptal</Button>
                    <Button variant="contained" onClick={handleDelete} startIcon={<DeleteOutlineIcon />}
                        sx={{ bgcolor: '#FF5252', color: '#fff', fontWeight: 700, '&:hover': { bgcolor: '#FF7070' } }}>
                        Evet, Sil
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Snackbar ── */}
            <Snackbar
                open={snack.open}
                autoHideDuration={3000}
                onClose={() => setSnack((p) => ({ ...p, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snack.severity} onClose={() => setSnack((p) => ({ ...p, open: false }))}
                    sx={{ fontWeight: 600 }}>
                    {snack.msg}
                </Alert>
            </Snackbar>
        </Box>
    );
}
