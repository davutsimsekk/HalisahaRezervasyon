import { useState, useMemo } from 'react';
import {
    Box, Typography, Grid, Card, CardContent,
    Chip, Avatar, Tooltip, Switch, FormControlLabel,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Stack, Divider, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Select, MenuItem, InputLabel,
    FormControl, Tabs, Tab,
} from '@mui/material';
import RefereePanel from './RefereePanel';
import { useRole } from '../context/RoleContext';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import TuneIcon from '@mui/icons-material/Tune';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SendIcon from '@mui/icons-material/Send';
import CampaignIcon from '@mui/icons-material/Campaign';
import AddIcon from '@mui/icons-material/Add';
import { players } from '../data/players';

// ─── Sabit veriler ──────────────────────────────────────────────────────────
const DAYS_TR = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const HOURS = Array.from({ length: 15 }, (_, i) => i + 9);
const BASE_PRICE = 500;

const seed = (s) => { const x = Math.sin(s + 1) * 10000; return x - Math.floor(x); };

const OCCUPANCY = (() => {
    const data = {};
    DAYS_TR.forEach((day, di) => {
        data[day] = {};
        HOURS.forEach((h, hi) => {
            const isWeekend = di >= 5;
            let base;
            if (h >= 18 && h <= 21) base = isWeekend ? 92 : 78;
            else if (h >= 16 && h < 18) base = isWeekend ? 68 : 52;
            else if (h >= 9 && h <= 11) base = isWeekend ? 55 : 18;
            else if (h >= 12 && h < 16) base = isWeekend ? 48 : 28;
            else base = isWeekend ? 38 : 12;
            data[day][h] = Math.min(100, Math.max(0, base + Math.round(seed(di * 20 + hi) * 18 - 9)));
        });
    });
    return data;
})();

const WEEKLY_REVENUE = [
    { day: 'Pzt', revenue: 4200, res: 9 },
    { day: 'Sal', revenue: 3850, res: 8 },
    { day: 'Çar', revenue: 5100, res: 11 },
    { day: 'Per', revenue: 4600, res: 10 },
    { day: 'Cum', revenue: 6300, res: 14 },
    { day: 'Cmt', revenue: 8750, res: 19 },
    { day: 'Paz', revenue: 7900, res: 17 },
];

const MONTHLY_REVENUE = [
    { label: 'Oca', revenue: 68000 }, { label: 'Şub', revenue: 72000 },
    { label: 'Mar', revenue: 81000 }, { label: 'Nis', revenue: 76000 },
    { label: 'May', revenue: 88000 }, { label: 'Haz', revenue: 95000 },
    { label: 'Tem', revenue: 102000 }, { label: 'Ağu', revenue: 98000 },
    { label: 'Eyl', revenue: 91000 }, { label: 'Eki', revenue: 84000 },
    { label: 'Kas', revenue: 79000 }, { label: 'Ara', revenue: 87000 },
];

const TOP_CUSTOMERS = players.slice(0, 8).map((p, i) => ({
    ...p,
    bookingCount: [14, 11, 9, 8, 7, 6, 6, 5][i],
    totalSpent: [6300, 5500, 3420, 3600, 2800, 2400, 2200, 1950][i],
    lastVisit: ['3 gün önce', '1 hafta önce', 'Dün', '5 gün önce', '2 gün önce', '10 gün önce', '4 gün önce', '1 hafta önce'][i],
}));

const INITIAL_RULES = [
    { id: 1, name: 'Peak Saatleri Artışı', desc: 'Doluluk %80+ ise fiyat %25 artar', action: '+%25', color: '#00E676', active: true },
    { id: 2, name: 'Boş Saat İndirimi', desc: 'Doluluk %30 altında ise %20 indirim', action: '-%20', color: '#FF9800', active: true },
    { id: 3, name: 'Sabah Erken Kuşu', desc: 'Hafta içi 09:00–12:00 arası %30 indirim', action: '-%30', color: '#448AFF', active: false },
    { id: 4, name: 'Hafta Sonu Artışı', desc: 'Cumartesi & Pazar tüm saatler %15 artar', action: '+%15', color: '#FFD600', active: true },
    { id: 5, name: 'Gece Kampanyası', desc: '22:00 sonrası %15 indirim', action: '-%15', color: '#CE93D8', active: false },
];

const INITIAL_CAMPAIGNS = [
    { id: 1, slot: 'Salı 10:00–12:00', discount: '30%', sent: 48, booked: 7, revenue: '1.050 ₺', rate: 15 },
    { id: 2, slot: 'Çarşamba 14:00–16:00', discount: '25%', sent: 62, booked: 12, revenue: '2.250 ₺', rate: 19 },
    { id: 3, slot: 'Perşembe 09:00–11:00', discount: '35%', sent: 35, booked: 5, revenue: '975 ₺', rate: 14 },
];

// ─── Yardımcılar ──────────────────────────────────────────────────────────────
const occColor = (v) => {
    if (v >= 85) return '#00E676';
    if (v >= 65) return '#69F0AE';
    if (v >= 45) return '#FFD600';
    if (v >= 25) return '#FF9800';
    return '#FF5252';
};

const calcDynPrice = (occ, rules) => {
    let m = 1;
    rules.forEach((r) => {
        if (!r.active) return;
        if (r.id === 1 && occ > 80) m += 0.25;
        if (r.id === 2 && occ < 30) m -= 0.20;
        if (r.id === 5) m -= 0.15;
    });
    return Math.round(BASE_PRICE * m);
};

// ─── Alt bileşenler ───────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, sub, color, trend }) => (
    <Card sx={{ height: '100%' }}>
        <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
                <Box sx={{
                    width: 44, height: 44, borderRadius: 2,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    bgcolor: `${color}18`, color,
                }}>
                    {icon}
                </Box>
                {trend !== undefined && (
                    <Chip size="small"
                        icon={trend >= 0 ? <TrendingUpIcon sx={{ fontSize: 13 }} /> : <TrendingDownIcon sx={{ fontSize: 13 }} />}
                        label={`${trend >= 0 ? '+' : ''}${trend}%`}
                        sx={{
                            bgcolor: trend >= 0 ? 'rgba(0,230,118,0.1)' : 'rgba(255,82,82,0.1)',
                            color: trend >= 0 ? '#00E676' : '#FF5252',
                            fontWeight: 700, fontSize: '0.68rem', height: 22,
                            '& .MuiChip-icon': { color: 'inherit' },
                        }}
                    />
                )}
            </Box>
            <Typography variant="caption" color="text.secondary"
                sx={{ textTransform: 'uppercase', letterSpacing: 0.8, fontSize: '0.68rem' }}>
                {label}
            </Typography>
            <Typography variant="h5" fontWeight={800} sx={{ color, mt: 0.25 }}>{value}</Typography>
            {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
        </CardContent>
    </Card>
);

const HeatCell = ({ value, selected, onClick }) => (
    <Tooltip title={`%${value} doluluk`} arrow>
        <Box onClick={onClick} sx={{
            width: '100%', height: 18, borderRadius: 0.5,
            bgcolor: occColor(value),
            opacity: 0.15 + (value / 100) * 0.85,
            cursor: 'pointer', transition: 'all 0.15s',
            outline: selected ? `2px solid #fff` : 'none',
            outlineOffset: 1,
            '&:hover': { opacity: 1, filter: 'brightness(1.2)' },
        }} />
    </Tooltip>
);

// ─── Ana sayfa ────────────────────────────────────────────────────────────────
export default function OwnerDashboard() {
    const { currentRole } = useRole();
    const [activeTab, setActiveTab] = useState(currentRole === 'referee' ? 1 : 0);
    const [period, setPeriod] = useState('weekly');
    const [rules, setRules] = useState(INITIAL_RULES);
    const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [campaignModal, setCampaignModal] = useState(false);
    const [newCampaign, setNewCampaign] = useState({ slot: '', discount: 20, audience: 'all', channel: 'sms_push' });

    const toggleRule = (id) => setRules((prev) => prev.map((r) => r.id === id ? { ...r, active: !r.active } : r));

    const totalWeeklyRev = WEEKLY_REVENUE.reduce((s, d) => s + d.revenue, 0);
    const totalWeeklyRes = WEEKLY_REVENUE.reduce((s, d) => s + d.res, 0);
    const maxRev = Math.max(...(period === 'weekly' ? WEEKLY_REVENUE : MONTHLY_REVENUE).map((d) => d.revenue));

    const { dayAvgs, hourAvgs } = useMemo(() => {
        const dAvgs = {};
        DAYS_TR.forEach((day) => {
            const vals = HOURS.map((h) => OCCUPANCY[day][h]);
            dAvgs[day] = Math.round(vals.reduce((s, v) => s + v, 0) / vals.length);
        });
        const hAvgs = {};
        HOURS.forEach((h) => {
            const vals = DAYS_TR.map((day) => OCCUPANCY[day][h]);
            hAvgs[h] = Math.round(vals.reduce((s, v) => s + v, 0) / vals.length);
        });
        return { dayAvgs: dAvgs, hourAvgs: hAvgs };
    }, []);

    const { avgOcc, emptySlots, peakSlots, dynGain } = useMemo(() => {
        let sum = 0, count = 0, empty = 0, peak = 0, base = 0, dyn = 0;
        DAYS_TR.forEach((day) => HOURS.forEach((h) => {
            const v = OCCUPANCY[day][h];
            sum += v; count++;
            if (v < 30) empty++;
            if (v > 80) peak++;
            base += BASE_PRICE * (v / 100);
            dyn += calcDynPrice(v, rules) * (v / 100);
        }));
        return { avgOcc: Math.round(sum / count), emptySlots: empty, peakSlots: peak, dynGain: Math.round(dyn - base) };
    }, [rules]);

    const criticalSlots = useMemo(() => {
        const list = [];
        DAYS_TR.forEach((day) => HOURS.forEach((h) => {
            if (OCCUPANCY[day][h] < 30) list.push({ day, hour: h, occ: OCCUPANCY[day][h] });
        }));
        return list.sort((a, b) => a.occ - b.occ).slice(0, 7);
    }, []);

    const selectedInfo = selectedSlot
        ? { ...selectedSlot, occ: OCCUPANCY[selectedSlot.day][selectedSlot.hour], dynPrice: calcDynPrice(OCCUPANCY[selectedSlot.day][selectedSlot.hour], rules) }
        : null;

    const chartData = period === 'weekly' ? WEEKLY_REVENUE : MONTHLY_REVENUE;

    const handleAddCampaign = () => {
        if (!newCampaign.slot) return;
        setCampaigns((prev) => [...prev, {
            id: prev.length + 1,
            slot: newCampaign.slot,
            discount: `${newCampaign.discount}%`,
            sent: 0, booked: 0, revenue: '—', rate: 0,
        }]);
        setCampaignModal(false);
        setNewCampaign({ slot: '', discount: 20, audience: 'all', channel: 'sms_push' });
    };

    const panelSx = {
        background: 'rgba(17,24,39,0.8)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 3,
        p: 2.5,
        height: '100%',
    };

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4, px: { xs: 2, md: 4 } }}>

                {/* ── Header ── */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                            <Typography variant="h4" fontWeight={800}
                                sx={{ background: 'linear-gradient(135deg, #00E676, #448AFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                Yıldız Arena
                            </Typography>
                            <Chip label="İşletme Kontrol Merkezi" size="small"
                                sx={{ bgcolor: 'rgba(0,230,118,0.1)', color: '#00E676', fontWeight: 700, fontSize: '0.72rem' }} />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                            Kadıköy, İstanbul · Günlük gelir, doluluk ve akıllı fiyatlandırma
                        </Typography>
                    </Box>
                    <Chip
                        icon={<Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#00E676', animation: 'pulse 2s infinite', '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } } }} />}
                        label="Canlı"
                        sx={{ bgcolor: 'rgba(0,230,118,0.08)', color: '#00E676', fontWeight: 700, border: '1px solid rgba(0,230,118,0.2)' }}
                    />
                </Box>

                {/* ── Rol Tabları ── */}
                <Box sx={{ mb: 3, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <Tabs
                        value={activeTab}
                        onChange={(_, v) => setActiveTab(v)}
                        sx={{
                            '& .MuiTabs-indicator': { bgcolor: activeTab === 0 ? '#00E676' : '#FFD600' },
                            minHeight: 44,
                        }}
                    >
                        <Tab
                            label="🏟️ Saha İşletmecisi"
                            sx={{
                                fontWeight: 700, fontSize: '0.9rem', minHeight: 44, textTransform: 'none',
                                color: 'text.secondary', '&.Mui-selected': { color: '#00E676' },
                            }}
                        />
                        <Tab
                            label="🟨 Hakem Paneli"
                            sx={{
                                fontWeight: 700, fontSize: '0.9rem', minHeight: 44, textTransform: 'none',
                                color: 'text.secondary', '&.Mui-selected': { color: '#FFD600' },
                            }}
                        />
                    </Tabs>
                </Box>

                {activeTab === 1 && <RefereePanel />}

                {activeTab === 0 && (<>

                {/* ── Özet Kartlar ── */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    {[
                        { icon: <AttachMoneyIcon />, label: 'Haftalık Gelir', value: `${(totalWeeklyRev / 1000).toFixed(1)}K ₺`, sub: 'Son 7 gün', color: '#00E676', trend: 12 },
                        { icon: <WhatshotIcon />, label: 'Ort. Doluluk', value: `%${avgOcc}`, sub: 'Haftalık ortalama', color: '#448AFF', trend: 5 },
                        { icon: <EventAvailableIcon />, label: 'Rezervasyon', value: totalWeeklyRes, sub: 'Bu hafta', color: '#FFD600', trend: 8 },
                        { icon: <TuneIcon />, label: 'Dinamik Ek Gelir', value: `+${(dynGain / 1000).toFixed(1)}K ₺`, sub: `${peakSlots} peak · ${emptySlots} boş slot`, color: '#CE93D8', trend: undefined },
                    ].map((s, i) => (
                        <Grid key={i} size={{ xs: 12, sm: 6, lg: 3 }}>
                            <StatCard {...s} />
                        </Grid>
                    ))}
                </Grid>

                {/* ── Satır 2: Isı Haritası | Fiyat Kuralları | Haftalık Özet ── */}
                <Grid container spacing={2} sx={{ mb: 2 }}>

                    {/* Sol: Doluluk Isı Haritası */}
                    <Grid size={{ xs: 12, lg: 5 }}>
                        <Box sx={panelSx}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                <WhatshotIcon sx={{ color: '#FF9800', fontSize: 18 }} />
                                <Typography variant="h6" fontWeight={700} fontSize="0.95rem">Doluluk Isı Haritası</Typography>
                                {selectedInfo && (
                                    <Chip size="small" label={`${selectedInfo.day} ${selectedInfo.hour}:00`}
                                        sx={{ bgcolor: 'rgba(68,138,255,0.12)', color: '#448AFF', fontWeight: 700, height: 20, ml: 'auto', fontSize: '0.65rem' }} />
                                )}
                            </Box>

                            {/* Header */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: '30px repeat(7, 1fr)', gap: '2px', mb: '2px' }}>
                                <Box />
                                {DAYS_TR.map((d) => (
                                    <Typography key={d} variant="caption" color="primary.main"
                                        sx={{ textAlign: 'center', fontWeight: 700, fontSize: '0.63rem' }}>{d}</Typography>
                                ))}
                            </Box>

                            {/* Rows */}
                            {HOURS.map((h) => (
                                <Box key={h} sx={{ display: 'grid', gridTemplateColumns: '30px repeat(7, 1fr)', gap: '2px', mb: '2px' }}>
                                    <Typography variant="caption" color="text.secondary"
                                        sx={{ fontSize: '0.55rem', display: 'flex', alignItems: 'center', opacity: 0.7 }}>
                                        {`${h}:00`}
                                    </Typography>
                                    {DAYS_TR.map((day) => (
                                        <HeatCell
                                            key={day}
                                            value={OCCUPANCY[day][h]}
                                            selected={selectedSlot?.day === day && selectedSlot?.hour === h}
                                            onClick={() => setSelectedSlot(selectedSlot?.day === day && selectedSlot?.hour === h ? null : { day, hour: h })}
                                        />
                                    ))}
                                </Box>
                            ))}

                            {/* Legend */}
                            <Box sx={{ display: 'flex', gap: 1.5, mt: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                                {[['#FF5252', '0–24%'], ['#FF9800', '25–44%'], ['#FFD600', '45–64%'], ['#69F0AE', '65–84%'], ['#00E676', '85%+']].map(([c, l]) => (
                                    <Box key={l} sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                                        <Box sx={{ width: 8, height: 8, borderRadius: 0.5, bgcolor: c }} />
                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.58rem' }}>{l}</Typography>
                                    </Box>
                                ))}
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.58rem', ml: 'auto', opacity: 0.6 }}>
                                    Tıkla → detay
                                </Typography>
                            </Box>

                            {/* Seçili slot detayı */}
                            {selectedInfo && (
                                <Box sx={{
                                    mt: 1.5, p: 1.5, borderRadius: 2,
                                    bgcolor: 'rgba(68,138,255,0.06)',
                                    border: '1px solid rgba(68,138,255,0.2)',
                                    display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap',
                                }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.62rem' }}>Saat</Typography>
                                        <Typography fontWeight={700} color="#448AFF" fontSize="0.85rem">{selectedInfo.day} {selectedInfo.hour}:00</Typography>
                                    </Box>
                                    <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.62rem' }}>Doluluk</Typography>
                                        <Typography fontWeight={700} sx={{ color: occColor(selectedInfo.occ), fontSize: '0.85rem' }}>%{selectedInfo.occ}</Typography>
                                    </Box>
                                    <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.62rem' }}>Dinamik Fiyat</Typography>
                                        <Typography fontWeight={800} fontSize="0.85rem" color={selectedInfo.dynPrice > BASE_PRICE ? '#00E676' : selectedInfo.dynPrice < BASE_PRICE ? '#FF5252' : 'text.primary'}>
                                            {selectedInfo.dynPrice} ₺
                                            {selectedInfo.dynPrice !== BASE_PRICE && (
                                                <Box component="span" sx={{ fontSize: '0.62rem', ml: 0.4, opacity: 0.7 }}>
                                                    ({selectedInfo.dynPrice > BASE_PRICE ? '+' : ''}{Math.round((selectedInfo.dynPrice - BASE_PRICE) / BASE_PRICE * 100)}%)
                                                </Box>
                                            )}
                                        </Typography>
                                    </Box>
                                    {selectedInfo.occ < 30 && (
                                        <Button size="small" variant="outlined"
                                            onClick={() => { setNewCampaign((p) => ({ ...p, slot: `${selectedInfo.day} ${selectedInfo.hour}:00` })); setCampaignModal(true); }}
                                            startIcon={<SendIcon sx={{ fontSize: 13 }} />}
                                            sx={{ ml: 'auto', borderColor: '#00E676', color: '#00E676', fontSize: '0.7rem', py: 0.4,
                                                '&:hover': { borderColor: '#00E676', bgcolor: 'rgba(0,230,118,0.08)' } }}>
                                            Kampanya
                                        </Button>
                                    )}
                                </Box>
                            )}
                        </Box>
                    </Grid>

                    {/* Orta: Fiyat Kuralları */}
                    <Grid size={{ xs: 12, lg: 4 }}>
                        <Box sx={panelSx}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <TuneIcon sx={{ color: '#CE93D8', fontSize: 18 }} />
                                    <Typography variant="h6" fontWeight={700} fontSize="0.95rem">Fiyat Kuralları</Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem' }}>Baz: <strong style={{ color: '#448AFF' }}>{BASE_PRICE} ₺</strong></Typography>
                            </Box>

                            <Stack spacing={0.75}>
                                {rules.map((rule) => (
                                    <Box key={rule.id} onClick={() => toggleRule(rule.id)} sx={{
                                        display: 'flex', alignItems: 'center', gap: 1.25,
                                        p: 1.25, borderRadius: 2, cursor: 'pointer',
                                        bgcolor: rule.active ? `${rule.color}08` : 'rgba(255,255,255,0.02)',
                                        border: `1px solid ${rule.active ? rule.color + '25' : 'rgba(255,255,255,0.05)'}`,
                                        opacity: rule.active ? 1 : 0.45,
                                        transition: 'all 0.2s',
                                        '&:hover': { borderColor: rule.color + '50', opacity: 1 },
                                    }}>
                                        <Box sx={{
                                            width: 34, height: 20, borderRadius: 10, flexShrink: 0,
                                            bgcolor: rule.active ? rule.color : 'rgba(255,255,255,0.12)',
                                            position: 'relative', transition: 'background 0.25s',
                                        }}>
                                            <Box sx={{
                                                position: 'absolute', top: 2,
                                                left: rule.active ? 16 : 2,
                                                width: 16, height: 16, borderRadius: '50%',
                                                bgcolor: '#fff', transition: 'left 0.25s',
                                                boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                                            }} />
                                        </Box>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography variant="body2" fontWeight={700} sx={{ lineHeight: 1.2, fontSize: '0.8rem' }}>{rule.name}</Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.63rem' }}>{rule.desc}</Typography>
                                        </Box>
                                        <Chip size="small" label={rule.action}
                                            sx={{
                                                bgcolor: rule.action.startsWith('+') ? 'rgba(0,230,118,0.1)' : 'rgba(255,82,82,0.1)',
                                                color: rule.action.startsWith('+') ? '#00E676' : '#FF5252',
                                                fontWeight: 800, fontSize: '0.68rem', height: 20, flexShrink: 0,
                                            }} />
                                    </Box>
                                ))}
                            </Stack>

                            <Box sx={{ mt: 1.5, p: 1.25, borderRadius: 2, bgcolor: 'rgba(206,147,216,0.06)', border: '1px dashed rgba(206,147,216,0.25)' }}>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                                    Aktif kurallarla tahmini haftalık ek gelir
                                </Typography>
                                <Typography fontWeight={800} sx={{ color: '#CE93D8', fontSize: '1rem' }}>
                                    +{(dynGain / 1000).toFixed(1)}K ₺
                                </Typography>
                            </Box>

                            {/* Fiyat Simülatörü */}
                            <Box sx={{ mt: 1.5, p: 1.25, borderRadius: 2, bgcolor: 'rgba(68,138,255,0.04)', border: '1px solid rgba(68,138,255,0.12)' }}>
                                <Typography variant="caption" color="text.secondary"
                                    sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.6rem', display: 'block', mb: 1 }}>
                                    Fiyat Simülasyonu
                                </Typography>
                                {[15, 40, 65, 85, 95].map((occ) => {
                                    const price = calcDynPrice(occ, rules);
                                    const diff = price - BASE_PRICE;
                                    return (
                                        <Box key={occ} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                                            <Box sx={{ width: 28, height: 6, borderRadius: 1, bgcolor: occColor(occ), flexShrink: 0 }} />
                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.63rem', width: 55, flexShrink: 0 }}>
                                                %{occ} dolu
                                            </Typography>
                                            <Box sx={{ flex: 1, height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                                                <Box sx={{ height: '100%', width: `${(price / (BASE_PRICE * 1.5)) * 100}%`, bgcolor: occColor(occ), borderRadius: 2, transition: 'width 0.5s ease' }} />
                                            </Box>
                                            <Typography variant="caption" fontWeight={800} sx={{
                                                fontSize: '0.7rem', flexShrink: 0, width: 68, textAlign: 'right',
                                                color: diff > 0 ? '#00E676' : diff < 0 ? '#FF5252' : 'text.primary',
                                            }}>
                                                {price} ₺{diff !== 0 && (
                                                    <Box component="span" sx={{ fontSize: '0.57rem', ml: 0.3, opacity: 0.75 }}>
                                                        ({diff > 0 ? '+' : ''}{Math.round((diff / BASE_PRICE) * 100)}%)
                                                    </Box>
                                                )}
                                            </Typography>
                                        </Box>
                                    );
                                })}
                            </Box>
                        </Box>
                    </Grid>

                    {/* Sağ: Haftalık Özet */}
                    <Grid size={{ xs: 12, lg: 3 }}>
                        <Box sx={{ ...panelSx, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <BarChartIcon sx={{ color: '#FFD600', fontSize: 18 }} />
                                <Typography variant="h6" fontWeight={700} fontSize="0.95rem">Haftalık Özet</Typography>
                            </Box>

                            {/* Günlük doluluk */}
                            <Box>
                                <Typography variant="caption" color="text.secondary"
                                    sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.6rem', display: 'block', mb: 1 }}>
                                    Gün bazlı ort. doluluk
                                </Typography>
                                <Stack spacing={0.75}>
                                    {DAYS_TR.map((day) => {
                                        const avg = dayAvgs[day];
                                        return (
                                            <Box key={day} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="caption" sx={{ width: 26, fontSize: '0.65rem', fontWeight: 700, color: avg >= 65 ? '#00E676' : avg >= 40 ? '#FFD600' : '#FF9800' }}>
                                                    {day}
                                                </Typography>
                                                <Box sx={{ flex: 1, height: 8, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                                                    <Box sx={{
                                                        height: '100%', width: `${avg}%`, borderRadius: 2,
                                                        bgcolor: occColor(avg),
                                                        transition: 'width 0.7s ease',
                                                    }} />
                                                </Box>
                                                <Typography variant="caption" fontWeight={800} sx={{ width: 30, textAlign: 'right', fontSize: '0.65rem', color: occColor(avg) }}>
                                                    %{avg}
                                                </Typography>
                                            </Box>
                                        );
                                    })}
                                </Stack>
                            </Box>

                            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

                            {/* Saat bazlı özet */}
                            <Box>
                                <Typography variant="caption" color="text.secondary"
                                    sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.6rem', display: 'block', mb: 1 }}>
                                    Saat dilimi verimliliği
                                </Typography>
                                {[
                                    { label: '09:00–12:00', hours: [9,10,11], color: '#FF5252' },
                                    { label: '12:00–16:00', hours: [12,13,14,15], color: '#FF9800' },
                                    { label: '16:00–19:00', hours: [16,17,18], color: '#FFD600' },
                                    { label: '19:00–23:00', hours: [19,20,21,22], color: '#00E676' },
                                ].map(({ label, hours, color }) => {
                                    const avg = Math.round(hours.reduce((s, h) => s + (hourAvgs[h] ?? 0), 0) / hours.length);
                                    return (
                                        <Box key={label} sx={{ mb: 0.75 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.63rem' }}>{label}</Typography>
                                                <Typography variant="caption" fontWeight={800} sx={{ color, fontSize: '0.63rem' }}>%{avg}</Typography>
                                            </Box>
                                            <Box sx={{ height: 5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                                                <Box sx={{ height: '100%', width: `${avg}%`, borderRadius: 2, bgcolor: color, transition: 'width 0.8s ease' }} />
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Box>

                            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

                            {/* En iyi / en kötü */}
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Box sx={{ flex: 1, p: 1.25, borderRadius: 2, bgcolor: 'rgba(0,230,118,0.06)', border: '1px solid rgba(0,230,118,0.15)', textAlign: 'center' }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', display: 'block' }}>En dolu gün</Typography>
                                    <Typography fontWeight={800} color="#00E676" sx={{ fontSize: '1rem' }}>
                                        {Object.entries(dayAvgs).sort((a, b) => b[1] - a[1])[0][0]}
                                    </Typography>
                                    <Typography variant="caption" color="#00E676" sx={{ fontSize: '0.65rem' }}>
                                        %{Object.entries(dayAvgs).sort((a, b) => b[1] - a[1])[0][1]}
                                    </Typography>
                                </Box>
                                <Box sx={{ flex: 1, p: 1.25, borderRadius: 2, bgcolor: 'rgba(255,82,82,0.06)', border: '1px solid rgba(255,82,82,0.15)', textAlign: 'center' }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', display: 'block' }}>En boş gün</Typography>
                                    <Typography fontWeight={800} color="#FF5252" sx={{ fontSize: '1rem' }}>
                                        {Object.entries(dayAvgs).sort((a, b) => a[1] - b[1])[0][0]}
                                    </Typography>
                                    <Typography variant="caption" color="#FF5252" sx={{ fontSize: '0.65rem' }}>
                                        %{Object.entries(dayAvgs).sort((a, b) => a[1] - b[1])[0][1]}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                {/* ── Satır 3: Gelir Grafiği | Kritik Boş Slotlar ── */}
                <Grid container spacing={2} sx={{ mb: 2 }}>

                    {/* Sol: Gelir Grafiği */}
                    <Grid size={{ xs: 12, lg: 7 }}>
                        <Box sx={panelSx}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <BarChartIcon sx={{ color: '#00E676', fontSize: 20 }} />
                                    <Typography variant="h6" fontWeight={700} fontSize="1rem">Gelir Grafiği</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', borderRadius: 1.5, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    {['weekly', 'monthly'].map((p) => (
                                        <Box key={p} onClick={() => setPeriod(p)} sx={{
                                            px: 1.5, py: 0.5, cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600,
                                            bgcolor: period === p ? 'rgba(0,230,118,0.15)' : 'transparent',
                                            color: period === p ? '#00E676' : 'text.secondary',
                                            transition: 'all 0.2s',
                                        }}>
                                            {p === 'weekly' ? 'Haftalık' : 'Aylık'}
                                        </Box>
                                    ))}
                                </Box>
                            </Box>

                            {/* Bars */}
                            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: 140, mb: 1 }}>
                                {chartData.map((d, i) => {
                                    const pct = (d.revenue / maxRev) * 100;
                                    const isTop = d.revenue === maxRev;
                                    return (
                                        <Tooltip key={i} title={`${(d.revenue / 1000).toFixed(1)}K ₺`} arrow>
                                            <Box sx={{
                                                flex: 1, height: `${pct}%`, borderRadius: '4px 4px 0 0',
                                                background: isTop
                                                    ? 'linear-gradient(180deg,#00E676,#00C853)'
                                                    : 'linear-gradient(180deg,rgba(0,230,118,0.45),rgba(0,230,118,0.18))',
                                                cursor: 'pointer', transition: 'all 0.25s', transformOrigin: 'bottom',
                                                '&:hover': { background: 'linear-gradient(180deg,#69F0AE,#00E676)', transform: 'scaleY(1.04)' },
                                            }} />
                                        </Tooltip>
                                    );
                                })}
                            </Box>
                            <Box sx={{ display: 'flex', gap: '6px' }}>
                                {chartData.map((d, i) => (
                                    <Typography key={i} variant="caption" color="text.secondary"
                                        sx={{ flex: 1, textAlign: 'center', fontSize: '0.62rem' }}>
                                        {d.day || d.label}
                                    </Typography>
                                ))}
                            </Box>

                            <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.05)' }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Toplam</Typography>
                                    <Typography variant="h6" fontWeight={800} color="primary.main">
                                        {period === 'weekly'
                                            ? `${(totalWeeklyRev / 1000).toFixed(1)}K ₺`
                                            : `${(MONTHLY_REVENUE.reduce((s, d) => s + d.revenue, 0) / 1000).toFixed(0)}K ₺`}
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="caption" color="text.secondary">En iyi</Typography>
                                    <Typography variant="body2" fontWeight={700} color="primary.main">
                                        {period === 'weekly' ? 'Cumartesi' : 'Temmuz'}
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="caption" color="text.secondary">Ortalama / gün</Typography>
                                    <Typography variant="body2" fontWeight={700}>
                                        {period === 'weekly'
                                            ? `${(totalWeeklyRev / 7 / 1000).toFixed(1)}K ₺`
                                            : `${(MONTHLY_REVENUE.reduce((s, d) => s + d.revenue, 0) / 365 / 1000).toFixed(1)}K ₺`}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Sağ: Kritik Boş Slotlar */}
                    <Grid size={{ xs: 12, lg: 5 }}>
                        <Box sx={{ ...panelSx, display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <NotificationsActiveIcon sx={{ color: '#FF5252', fontSize: 20 }} />
                                    <Typography variant="h6" fontWeight={700} fontSize="1rem">Kritik Boş Slotlar</Typography>
                                </Box>
                                <Chip size="small" label={`${emptySlots} slot`}
                                    sx={{ bgcolor: 'rgba(255,82,82,0.1)', color: '#FF5252', fontWeight: 700, height: 22, fontSize: '0.68rem' }} />
                            </Box>

                            <Stack spacing={0.75} sx={{ flex: 1, overflowY: 'auto', maxHeight: 340,
                                '&::-webkit-scrollbar': { width: 3 }, '&::-webkit-scrollbar-thumb': { bgcolor: '#FF525255', borderRadius: 2 } }}>
                                {criticalSlots.map((sl, i) => (
                                    <Box key={i} sx={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        p: 1.25, borderRadius: 2,
                                        bgcolor: 'rgba(255,82,82,0.04)',
                                        border: '1px solid rgba(255,82,82,0.1)',
                                        '&:hover': { borderColor: 'rgba(255,82,82,0.3)', bgcolor: 'rgba(255,82,82,0.07)' },
                                        transition: 'all 0.15s', cursor: 'pointer',
                                    }}
                                        onClick={() => setSelectedSlot({ day: sl.day, hour: sl.hour })}
                                    >
                                        <Box>
                                            <Typography variant="body2" fontWeight={700}>{sl.day} — {sl.hour}:00</Typography>
                                            <Typography variant="caption" sx={{ color: '#FF5252', fontWeight: 600 }}>%{sl.occ} doluluk</Typography>
                                        </Box>
                                        <Button size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setNewCampaign((p) => ({ ...p, slot: `${sl.day} ${sl.hour}:00` }));
                                                setCampaignModal(true);
                                            }}
                                            sx={{ fontSize: '0.72rem', color: '#448AFF', minWidth: 0, px: 1,
                                                '&:hover': { bgcolor: 'rgba(68,138,255,0.1)' } }}>
                                            Kampanya →
                                        </Button>
                                    </Box>
                                ))}
                            </Stack>

                            <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6, fontSize: '0.65rem' }}>
                                    Saate göre boş kalma oranı
                                </Typography>
                                {[['09:00–12:00', 62, '#FF5252'], ['12:00–16:00', 41, '#FF9800'], ['16:00–19:00', 18, '#FFD600'], ['19:00–23:00', 8, '#00E676']].map(([label, pct, color]) => (
                                    <Box key={label} sx={{ mb: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem' }}>{label}</Typography>
                                            <Typography variant="caption" fontWeight={700} sx={{ color, fontSize: '0.68rem' }}>%{pct}</Typography>
                                        </Box>
                                        <Box sx={{ height: 5, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                                            <Box sx={{ height: '100%', width: `${pct}%`, borderRadius: 3, bgcolor: color, transition: 'width 0.8s ease' }} />
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                {/* ── Satır 4: Kampanyalar | En Sadık Müşteriler ── */}
                <Grid container spacing={2}>

                    {/* Sol: Kampanyalar */}
                    <Grid size={{ xs: 12, lg: 7 }}>
                        <Box sx={panelSx}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CampaignIcon sx={{ color: '#FFD600', fontSize: 20 }} />
                                    <Typography variant="h6" fontWeight={700} fontSize="1rem">Otomatik Kampanyalar</Typography>
                                </Box>
                                <Button size="small" startIcon={<AddIcon sx={{ fontSize: 16 }} />}
                                    onClick={() => setCampaignModal(true)}
                                    sx={{
                                        bgcolor: 'rgba(0,230,118,0.1)', color: '#00E676',
                                        fontSize: '0.75rem', py: 0.5, px: 1.5,
                                        '&:hover': { bgcolor: 'rgba(0,230,118,0.18)' },
                                    }}>
                                    Yeni Kampanya
                                </Button>
                            </Box>

                            <TableContainer component={Paper} elevation={0}
                                sx={{ bgcolor: 'transparent', '& .MuiTableCell-root': { borderColor: 'rgba(255,255,255,0.04)', py: 1.25 } }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            {['Slot', 'İndirim', 'Gönderildi', 'Rezervasyon', 'Gelir', 'Dönüşüm'].map((h) => (
                                                <TableCell key={h} sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: 0.6 }}>
                                                    {h}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {campaigns.map((c) => (
                                            <TableRow key={c.id} sx={{ '&:hover td': { bgcolor: 'rgba(255,255,255,0.015)' } }}>
                                                <TableCell><Typography variant="body2" fontWeight={700}>{c.slot}</Typography></TableCell>
                                                <TableCell>
                                                    <Chip size="small" label={`-${c.discount}`}
                                                        sx={{ bgcolor: 'rgba(255,82,82,0.1)', color: '#FF5252', fontWeight: 700, height: 20, fontSize: '0.68rem' }} />
                                                </TableCell>
                                                <TableCell><Typography variant="body2" color="text.secondary">{c.sent ? `${c.sent} kişi` : '—'}</Typography></TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight={700} color="primary.main">{c.booked || '—'}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight={700} sx={{ color: '#448AFF' }}>{c.revenue}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    {c.rate > 0 ? (
                                                        <Chip size="small" label={`%${c.rate}`}
                                                            sx={{ bgcolor: 'rgba(0,230,118,0.1)', color: '#00E676', fontWeight: 700, height: 20, fontSize: '0.68rem' }} />
                                                    ) : <Typography variant="caption" color="text.secondary">—</Typography>}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Grid>

                    {/* Sağ: En Sadık Müşteriler */}
                    <Grid size={{ xs: 12, lg: 5 }}>
                        <Box sx={panelSx}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <PeopleIcon sx={{ color: '#448AFF', fontSize: 20 }} />
                                <Typography variant="h6" fontWeight={700} fontSize="1rem">En Sadık Müşteriler</Typography>
                            </Box>

                            <Stack spacing={0.75}>
                                {TOP_CUSTOMERS.map((c, i) => (
                                    <Box key={c.id} sx={{
                                        display: 'flex', alignItems: 'center', gap: 1.5,
                                        p: 1.25, borderRadius: 2,
                                        bgcolor: 'rgba(255,255,255,0.02)',
                                        border: '1px solid rgba(255,255,255,0.04)',
                                        '&:hover': { borderColor: 'rgba(68,138,255,0.2)', bgcolor: 'rgba(68,138,255,0.03)' },
                                        transition: 'all 0.2s',
                                    }}>
                                        <Box sx={{ position: 'relative', flexShrink: 0 }}>
                                            <Avatar src={c.avatar} sx={{ width: 34, height: 34 }} />
                                            {i < 3 && (
                                                <Box sx={{
                                                    position: 'absolute', top: -3, right: -3, width: 15, height: 15,
                                                    borderRadius: '50%',
                                                    bgcolor: i === 0 ? '#FFD600' : i === 1 ? '#B0BEC5' : '#CD7F32',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '0.58rem', fontWeight: 900,
                                                    color: i === 0 ? '#000' : '#fff',
                                                }}>{i + 1}</Box>
                                            )}
                                        </Box>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography variant="body2" fontWeight={700} noWrap>{c.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">{c.lastVisit}</Typography>
                                        </Box>
                                        <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                                            <Typography variant="body2" fontWeight={700} color="primary.main">{c.totalSpent.toLocaleString('tr-TR')} ₺</Typography>
                                            <Chip size="small" label={`${c.bookingCount} rez.`}
                                                sx={{ bgcolor: 'rgba(68,138,255,0.1)', color: '#448AFF', fontWeight: 700, height: 18, fontSize: '0.62rem' }} />
                                        </Box>
                                    </Box>
                                ))}
                            </Stack>

                            {/* Özet */}
                            <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Top 8 toplam harcama</Typography>
                                        <Typography variant="body2" fontWeight={800} color="#448AFF">
                                            {TOP_CUSTOMERS.reduce((s, c) => s + c.totalSpent, 0).toLocaleString('tr-TR')} ₺
                                        </Typography>
                                    </Box>
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Typography variant="caption" color="text.secondary">Toplam rezervasyon</Typography>
                                        <Typography variant="body2" fontWeight={800} color="primary.main">
                                            {TOP_CUSTOMERS.reduce((s, c) => s + c.bookingCount, 0)} rez.
                                        </Typography>
                                    </Box>
                                </Box>

                                <Typography variant="caption" color="text.secondary"
                                    sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, fontSize: '0.63rem', display: 'block', mb: 0.75 }}>
                                    Harcama Dağılımı
                                </Typography>
                                {TOP_CUSTOMERS.slice(0, 4).map((c) => {
                                    const maxSpent = TOP_CUSTOMERS[0].totalSpent;
                                    return (
                                        <Box key={c.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.6 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', width: 90, flexShrink: 0 }} noWrap>
                                                {c.name.split(' ')[0]}
                                            </Typography>
                                            <Box sx={{ flex: 1, height: 5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                                                <Box sx={{
                                                    height: '100%',
                                                    width: `${(c.totalSpent / maxSpent) * 100}%`,
                                                    borderRadius: 2,
                                                    background: 'linear-gradient(90deg, #448AFF, #00E676)',
                                                    transition: 'width 0.8s ease',
                                                }} />
                                            </Box>
                                            <Typography variant="caption" fontWeight={700} color="#448AFF"
                                                sx={{ fontSize: '0.65rem', width: 55, textAlign: 'right', flexShrink: 0 }}>
                                                {(c.totalSpent / 1000).toFixed(1)}K ₺
                                            </Typography>
                                        </Box>
                                    );
                                })}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

            {/* ── Kampanya Modal ── */}
            <Dialog open={campaignModal} onClose={() => setCampaignModal(false)} maxWidth="xs" fullWidth
                PaperProps={{ sx: { bgcolor: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 } }}>
                <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SendIcon sx={{ color: '#00E676', fontSize: 20 }} />
                        Kampanya Oluştur
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
                    <TextField label="Hedef Slot" size="small" fullWidth
                        value={newCampaign.slot}
                        onChange={(e) => setNewCampaign((p) => ({ ...p, slot: e.target.value }))}
                        placeholder="Örn: Salı 10:00"
                        sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' } } }}
                    />
                    <TextField label="İndirim Oranı (%)" size="small" fullWidth type="number"
                        value={newCampaign.discount}
                        onChange={(e) => setNewCampaign((p) => ({ ...p, discount: Number(e.target.value) }))}
                        inputProps={{ min: 5, max: 50 }}
                        sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' } } }}
                    />
                    <FormControl size="small" fullWidth>
                        <InputLabel>Hedef Kitle</InputLabel>
                        <Select value={newCampaign.audience} label="Hedef Kitle"
                            onChange={(e) => setNewCampaign((p) => ({ ...p, audience: e.target.value }))}>
                            <MenuItem value="all">Tüm kayıtlı müşteriler</MenuItem>
                            <MenuItem value="active">Son 30 gün aktif olanlar</MenuItem>
                            <MenuItem value="timeslot">Bu saatte oynamış müşteriler</MenuItem>
                            <MenuItem value="referral">Referans müşteriler</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl size="small" fullWidth>
                        <InputLabel>Bildirim Kanalı</InputLabel>
                        <Select value={newCampaign.channel} label="Bildirim Kanalı"
                            onChange={(e) => setNewCampaign((p) => ({ ...p, channel: e.target.value }))}>
                            <MenuItem value="sms_push">SMS + Push Bildirim</MenuItem>
                            <MenuItem value="sms">Sadece SMS</MenuItem>
                            <MenuItem value="push">Sadece Push</MenuItem>
                            <MenuItem value="whatsapp">WhatsApp</MenuItem>
                        </Select>
                    </FormControl>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(0,230,118,0.05)', border: '1px solid rgba(0,230,118,0.15)' }}>
                        <Typography variant="caption" color="primary.main" fontWeight={600}>
                            Tahmini: %{newCampaign.discount} indirimle bu slot için ~8–12 rezervasyon bekleniyor
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                    <Button onClick={() => setCampaignModal(false)}
                        sx={{ color: 'text.secondary', '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' } }}>
                        İptal
                    </Button>
                    <Button variant="contained" onClick={handleAddCampaign} startIcon={<SendIcon sx={{ fontSize: 16 }} />}
                        disabled={!newCampaign.slot}
                        sx={{ bgcolor: '#00E676', color: '#000', fontWeight: 700, '&:hover': { bgcolor: '#69F0AE' } }}>
                        Gönder
                    </Button>
                </DialogActions>
            </Dialog>
            </>)}
        </Box>
    );
}
