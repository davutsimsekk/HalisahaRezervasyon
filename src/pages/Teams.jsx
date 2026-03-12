import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Box, Container, Typography, Grid, Card, CardContent, Chip, Stack,
    Avatar, AvatarGroup, LinearProgress, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GroupsIcon from '@mui/icons-material/Groups';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useTeams, LOGO_OPTIONS, COLOR_OPTIONS } from '../context/TeamContext';

const CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Trabzon', 'Konya', 'Adana', 'Mersin', 'Gaziantep'];

export default function Teams() {
    const { teams, players, createTeam } = useTeams();
    const [createModal, setCreateModal] = useState(false);
    const [form, setForm] = useState({ name: '', logo: '⭐', city: '', color: '#448AFF', founded: '' });
    const [errors, setErrors] = useState({});

    const handleCreate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Takım adı zorunlu';
        if (!form.city.trim()) e.city = 'Şehir zorunlu';
        if (Object.keys(e).length) return setErrors(e);
        createTeam({ ...form, founded: form.founded || new Date().toISOString().slice(0, 7) });
        setCreateModal(false);
        setForm({ name: '', logo: '⭐', city: '', color: '#448AFF', founded: '' });
        setErrors({});
    };

    return (
        <Box sx={{ minHeight: '100vh', pt: 4, pb: 8 }}>
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mb: 5, flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography variant="h3" fontWeight={800} gutterBottom>Takımlar</Typography>
                        <Typography variant="h6" color="text.secondary" fontWeight={400}>
                            Tüm takımları keşfet · {teams.length} takım
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setCreateModal(true)}
                        sx={{ bgcolor: '#00E676', color: '#000', fontWeight: 700, '&:hover': { bgcolor: '#69F0AE' } }}
                    >
                        Yeni Takım Kur
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    {teams.map((team) => {
                        const totalGames = team.wins + team.losses + team.draws;
                        const winRate = totalGames > 0 ? ((team.wins / totalGames) * 100).toFixed(0) : 0;
                        const teamPlayers = players.filter((p) => team.playerIds.includes(p.id));

                        return (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={team.id}>
                                <Card component={Link} to={`/team/${team.id}`} sx={{ textDecoration: 'none', height: '100%', transition: 'transform 0.15s', '&:hover': { transform: 'translateY(-2px)' } }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                                            <Box sx={{
                                                width: 56, height: 56, borderRadius: 3, flexShrink: 0,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '2rem',
                                                backgroundColor: `${team.color}18`,
                                                border: `2px solid ${team.color}50`,
                                            }}>
                                                {team.logo}
                                            </Box>
                                            <Box sx={{ minWidth: 0 }}>
                                                <Typography variant="h6" fontWeight={700} noWrap>{team.name}</Typography>
                                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                                    <LocationOnIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                    <Typography variant="body2" color="text.secondary">{team.city}</Typography>
                                                </Stack>
                                            </Box>
                                        </Stack>

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

                                        <Box sx={{ mb: 2 }}>
                                            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                                                <Typography variant="caption" color="text.secondary">Kazanma Oranı</Typography>
                                                <Typography variant="caption" fontWeight={700} color="primary.main">{winRate}%</Typography>
                                            </Stack>
                                            <LinearProgress
                                                variant="determinate" value={Number(winRate)}
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

                                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                                <SportsSoccerIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                                                <Typography variant="body2">{team.goalsScored} gol attı</Typography>
                                            </Stack>
                                            <Typography variant="body2" color="text.secondary">{team.goalsConceded} gol yedi</Typography>
                                        </Stack>

                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            {teamPlayers.length > 0 ? (
                                                <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: '0.75rem' } }}>
                                                    {teamPlayers.map((p) => <Avatar key={p.id} src={p.avatar} />)}
                                                </AvatarGroup>
                                            ) : (
                                                <Typography variant="caption" color="text.secondary">Kadro boş</Typography>
                                            )}
                                            <Chip label={`⭐ ${team.rating}`} size="small" sx={{ fontWeight: 700 }} />
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>

            {/* ── Takım Kurma Modalı ── */}
            <Dialog
                open={createModal}
                onClose={() => { setCreateModal(false); setErrors({}); }}
                maxWidth="sm" fullWidth
                PaperProps={{ sx: { bgcolor: '#111827', border: '1px solid rgba(255,255,255,0.1)' } }}
            >
                <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
                    <Stack direction="row" alignItems="center" gap={1}>
                        <GroupsIcon sx={{ color: '#00E676' }} />
                        Yeni Takım Kur
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ pt: 1 }}>
                        {/* Logo */}
                        <Box>
                            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>Takım Logosu</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {LOGO_OPTIONS.map((emoji) => (
                                    <Box
                                        key={emoji}
                                        onClick={() => setForm((p) => ({ ...p, logo: emoji }))}
                                        sx={{
                                            width: 44, height: 44, borderRadius: 2, fontSize: '1.5rem',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', transition: 'all 0.15s',
                                            border: `2px solid ${form.logo === emoji ? '#00E676' : 'rgba(255,255,255,0.1)'}`,
                                            bgcolor: form.logo === emoji ? 'rgba(0,230,118,0.1)' : 'rgba(255,255,255,0.03)',
                                            '&:hover': { borderColor: '#00E676', bgcolor: 'rgba(0,230,118,0.06)' },
                                        }}
                                    >
                                        {emoji}
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                        {/* Takım Adı */}
                        <TextField
                            label="Takım Adı *"
                            value={form.name}
                            onChange={(e) => { setForm((p) => ({ ...p, name: e.target.value })); setErrors((er) => ({ ...er, name: '' })); }}
                            error={!!errors.name}
                            helperText={errors.name}
                            fullWidth
                            sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' } } }}
                        />

                        {/* Şehir */}
                        <TextField
                            label="Şehir *"
                            value={form.city}
                            onChange={(e) => { setForm((p) => ({ ...p, city: e.target.value })); setErrors((er) => ({ ...er, city: '' })); }}
                            error={!!errors.city}
                            helperText={errors.city}
                            fullWidth
                            sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' } } }}
                        />

                        {/* Kuruluş Tarihi */}
                        <TextField
                            label="Kuruluş Tarihi"
                            type="month"
                            value={form.founded}
                            onChange={(e) => setForm((p) => ({ ...p, founded: e.target.value }))}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' } } }}
                        />

                        {/* Renk */}
                        <Box>
                            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>Takım Rengi</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {COLOR_OPTIONS.map((c) => (
                                    <Tooltip key={c} title={c}>
                                        <Box
                                            onClick={() => setForm((p) => ({ ...p, color: c }))}
                                            sx={{
                                                width: 36, height: 36, borderRadius: '50%', bgcolor: c, cursor: 'pointer',
                                                border: `3px solid ${form.color === c ? '#fff' : 'transparent'}`,
                                                transition: 'all 0.15s', transform: form.color === c ? 'scale(1.2)' : 'scale(1)',
                                                '&:hover': { transform: 'scale(1.15)' },
                                            }}
                                        />
                                    </Tooltip>
                                ))}
                            </Box>
                        </Box>

                        {/* Önizleme */}
                        <Box sx={{
                            p: 2, borderRadius: 2,
                            border: `1px solid ${form.color}40`,
                            bgcolor: `${form.color}08`,
                            display: 'flex', alignItems: 'center', gap: 2,
                        }}>
                            <Box sx={{
                                width: 52, height: 52, borderRadius: 2,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.8rem',
                                bgcolor: `${form.color}18`,
                                border: `2px solid ${form.color}50`,
                            }}>
                                {form.logo}
                            </Box>
                            <Box>
                                <Typography fontWeight={800}>{form.name || 'Takım Adı'}</Typography>
                                <Typography variant="body2" color="text.secondary">{form.city || 'Şehir'}</Typography>
                            </Box>
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                    <Button onClick={() => { setCreateModal(false); setErrors({}); }}
                        sx={{ color: 'text.secondary', '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' } }}>
                        İptal
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleCreate}
                        startIcon={<AddIcon />}
                        sx={{ bgcolor: '#00E676', color: '#000', fontWeight: 700, '&:hover': { bgcolor: '#69F0AE' } }}
                    >
                        Takımı Kur
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
