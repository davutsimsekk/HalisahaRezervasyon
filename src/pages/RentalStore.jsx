import { useState } from 'react';
import {
    Box, Typography, Grid, Chip, Button, Stack, Divider, Tooltip,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Select, MenuItem, InputLabel, FormControl,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SearchIcon from '@mui/icons-material/Search';
import InventoryIcon from '@mui/icons-material/Inventory';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import StadiumIcon from '@mui/icons-material/Stadium';
import { rentalProducts, CATEGORIES, INITIAL_RENTALS, fieldInventory } from '../data/rentals';
import { fields } from '../data/fields';

const panelSx = {
    background: 'rgba(17,24,39,0.8)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 3,
    p: 2.5,
};

const stockInfo = (stock, total) => {
    if (stock === 0) return { label: 'Stok Yok', color: '#FF5252' };
    if (stock / total <= 0.3) return { label: `Son ${stock}`, color: '#FF9800' };
    return { label: `${stock} mevcut`, color: '#00E676' };
};

const statusChip = (status) => {
    if (status === 'active')    return { label: 'Aktif',       color: '#00E676', bg: 'rgba(0,230,118,0.1)' };
    if (status === 'upcoming')  return { label: 'Yaklaşan',    color: '#448AFF', bg: 'rgba(68,138,255,0.1)' };
    return                             { label: 'Tamamlandı',  color: '#94A3B8', bg: 'rgba(255,255,255,0.05)' };
};

export default function RentalStore() {
    const [category, setCategory]       = useState('all');
    const [search, setSearch]           = useState('');
    const [selectedField, setSelectedField] = useState('all');
    const [rentalModal, setRentalModal] = useState(false);
    const [selected, setSelected]       = useState(null);
    const [form, setForm]               = useState({ date: '', time: '18:00', duration: 2 });
    const [rentals, setRentals]         = useState(INITIAL_RENTALS);

    const fieldProducts = selectedField === 'all'
        ? rentalProducts
        : (() => {
            const inv = fieldInventory[Number(selectedField)] || {};
            return Object.entries(inv).map(([pid, stock]) => {
                const p = rentalProducts.find((r) => r.id === Number(pid));
                return p ? { ...p, stock } : null;
            }).filter(Boolean);
        })();

    const filtered = fieldProducts.filter((p) => {
        const matchCat    = category === 'all' || p.category === category;
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
            || p.brand.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    const totalPrice = selected
        ? (form.duration === 'day' ? selected.pricePerDay : selected.pricePerHour * Number(form.duration))
        : 0;

    const handleRent = () => {
        if (!selected || !form.date) return;
        setRentals((prev) => [...prev, {
            id: prev.length + 1,
            product: selected.name,
            emoji: selected.emoji,
            date: form.date,
            time: form.time,
            duration: form.duration === 'day' ? 'Tam Gün' : `${form.duration} saat`,
            total: totalPrice,
            status: 'upcoming',
        }]);
        setRentalModal(false);
        setSelected(null);
        setForm({ date: '', time: '18:00', duration: 2 });
    };

    const openRental = (product) => { setSelected(product); setRentalModal(true); };

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4, px: { xs: 2, md: 4 } }}>

            {/* ── Header ── */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                        <Typography variant="h4" fontWeight={800}
                            sx={{ background: 'linear-gradient(135deg, #00E676, #448AFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Ekipman Kiralama
                        </Typography>
                        <Chip label="Anlık Stok" size="small"
                            icon={<Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#00E676', ml: '8px !important', animation: 'pulse 2s infinite', '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } } }} />}
                            sx={{ bgcolor: 'rgba(0,230,118,0.08)', color: '#00E676', fontWeight: 700, border: '1px solid rgba(0,230,118,0.2)', fontSize: '0.7rem' }} />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        Top, krampon, eldiven ve daha fazlası — maçına hazır ol
                    </Typography>
                </Box>

                {/* Mini stat kartları */}
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    {[
                        { label: 'Toplam Ürün',    value: rentalProducts.length,                              color: '#448AFF' },
                        { label: 'Stokta Mevcut',  value: rentalProducts.filter((p) => p.stock > 0).length,  color: '#00E676' },
                        { label: 'Aktif Kiralama', value: rentals.filter((r) => r.status === 'active').length, color: '#FFD600' },
                    ].map((s) => (
                        <Box key={s.label} sx={{ ...panelSx, p: 1.5, textAlign: 'center', minWidth: 95 }}>
                            <Typography variant="h5" fontWeight={800} sx={{ color: s.color, lineHeight: 1 }}>{s.value}</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem' }}>{s.label}</Typography>
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* ── Saha Seçici ── */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 1 }}>
                    <StadiumIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                    <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.6, fontSize: '0.65rem' }}>
                        Saha
                    </Typography>
                </Box>
                <Chip label="Tüm Sahalar" onClick={() => setSelectedField('all')} sx={{
                    fontWeight: 700, fontSize: '0.75rem',
                    bgcolor: selectedField === 'all' ? 'rgba(68,138,255,0.18)' : 'rgba(255,255,255,0.04)',
                    color: selectedField === 'all' ? '#448AFF' : 'text.secondary',
                    border: `1px solid ${selectedField === 'all' ? 'rgba(68,138,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    '&:hover': { bgcolor: 'rgba(68,138,255,0.12)' }, transition: 'all 0.2s',
                }} />
                {fields.map((f) => (
                    <Chip key={f.id} label={f.name} onClick={() => setSelectedField(String(f.id))} sx={{
                        fontWeight: 600, fontSize: '0.73rem',
                        bgcolor: selectedField === String(f.id) ? 'rgba(68,138,255,0.18)' : 'rgba(255,255,255,0.04)',
                        color: selectedField === String(f.id) ? '#448AFF' : 'text.secondary',
                        border: `1px solid ${selectedField === String(f.id) ? 'rgba(68,138,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                        '&:hover': { bgcolor: 'rgba(68,138,255,0.12)' }, transition: 'all 0.2s',
                    }} />
                ))}
            </Box>

            {/* ── Filtreler ── */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                {CATEGORIES.map((cat) => (
                    <Chip key={cat.key} label={cat.label} onClick={() => setCategory(cat.key)} sx={{
                        fontWeight: 700, fontSize: '0.78rem',
                        bgcolor:  category === cat.key ? `${cat.color}20` : 'rgba(255,255,255,0.04)',
                        color:    category === cat.key ? cat.color : 'text.secondary',
                        border:  `1px solid ${category === cat.key ? cat.color + '40' : 'rgba(255,255,255,0.08)'}`,
                        '&:hover': { bgcolor: `${cat.color}15` },
                        transition: 'all 0.2s',
                    }} />
                ))}

                {/* Arama */}
                <Box sx={{
                    ml: 'auto', display: 'flex', alignItems: 'center', gap: 1,
                    bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 2, px: 1.5, py: 0.75,
                }}>
                    <SearchIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Ürün veya marka ara..."
                        style={{ background: 'none', border: 'none', outline: 'none', color: '#F1F5F9', fontSize: '0.85rem', width: 190 }}
                    />
                </Box>
            </Box>

            {/* ── Ürün Grid ── */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                {filtered.map((product) => {
                    const si = stockInfo(product.stock, product.totalStock);
                    return (
                        <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                            <Box sx={{
                                ...panelSx, height: '100%',
                                display: 'flex', flexDirection: 'column',
                                transition: 'all 0.22s',
                                '&:hover': {
                                    border: '1px solid rgba(0,230,118,0.2)',
                                    transform: 'translateY(-3px)',
                                    boxShadow: '0 10px 28px rgba(0,0,0,0.35)',
                                },
                            }}>
                                {/* Emoji + stok */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                                    <Box sx={{
                                        width: 58, height: 58, borderRadius: 2.5,
                                        bgcolor: 'rgba(255,255,255,0.04)',
                                        border: '1px solid rgba(255,255,255,0.07)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1.9rem',
                                    }}>
                                        {product.emoji}
                                    </Box>
                                    <Chip size="small" label={si.label} sx={{
                                        bgcolor: `${si.color}15`, color: si.color,
                                        fontWeight: 700, fontSize: '0.62rem', height: 20,
                                        border: `1px solid ${si.color}30`,
                                    }} />
                                </Box>

                                <Typography variant="body1" fontWeight={800} sx={{ lineHeight: 1.25, mb: 0.25 }}>
                                    {product.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.67rem', mb: 0.5 }}>
                                    {product.brand} · {product.spec}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', flex: 1, mb: 1.5, lineHeight: 1.5 }}>
                                    {product.desc}
                                </Typography>

                                {/* Rating */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                                    <StarIcon sx={{ color: '#FFD600', fontSize: 14 }} />
                                    <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.72rem' }}>
                                        {product.rating}
                                    </Typography>
                                    <Box sx={{ flex: 1 }} />
                                    <AccessTimeIcon sx={{ color: 'text.secondary', fontSize: 13 }} />
                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.63rem' }}>saatlik</Typography>
                                </Box>

                                <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mb: 1.5 }} />

                                {/* Fiyat + buton */}
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="h6" fontWeight={800} color="primary.main" sx={{ lineHeight: 1 }}>
                                            {product.pricePerHour} ₺
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.58rem' }}>/ saat</Typography>
                                    </Box>
                                    <Button
                                        size="small"
                                        disabled={product.stock === 0}
                                        onClick={() => openRental(product)}
                                        sx={{
                                            bgcolor: product.stock === 0 ? 'transparent' : 'rgba(0,230,118,0.12)',
                                            color: product.stock === 0 ? 'text.disabled' : '#00E676',
                                            border: `1px solid ${product.stock === 0 ? 'rgba(255,255,255,0.06)' : 'rgba(0,230,118,0.25)'}`,
                                            fontWeight: 700, fontSize: '0.75rem', boxShadow: 'none',
                                            '&:hover': { bgcolor: 'rgba(0,230,118,0.22)', boxShadow: 'none' },
                                            '&.Mui-disabled': { color: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.05)' },
                                        }}
                                    >
                                        {product.stock === 0 ? 'Tükendi' : 'Kirala'}
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    );
                })}
            </Grid>

            {/* ── Kiralama Geçmişi ── */}
            <Box sx={panelSx}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <InventoryIcon sx={{ color: '#448AFF', fontSize: 20 }} />
                    <Typography variant="h6" fontWeight={700} fontSize="1rem">Kiralama Geçmişi</Typography>
                    <Chip size="small" label={`${rentals.length} kayıt`}
                        sx={{ bgcolor: 'rgba(68,138,255,0.1)', color: '#448AFF', fontWeight: 700, height: 20, fontSize: '0.65rem', ml: 'auto' }} />
                </Box>
                <TableContainer component={Paper} elevation={0}
                    sx={{ bgcolor: 'transparent', '& .MuiTableCell-root': { borderColor: 'rgba(255,255,255,0.04)', py: 1.25 } }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                {['Ürün', 'Tarih', 'Saat', 'Süre', 'Toplam', 'Durum'].map((h) => (
                                    <TableCell key={h} sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 0.6 }}>
                                        {h}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rentals.map((r) => {
                                const sc = statusChip(r.status);
                                return (
                                    <TableRow key={r.id} sx={{ '&:hover td': { bgcolor: 'rgba(255,255,255,0.015)' } }}>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box sx={{ fontSize: '1.1rem' }}>{r.emoji}</Box>
                                                <Typography variant="body2" fontWeight={700}>{r.product}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell><Typography variant="body2" color="text.secondary">{r.date}</Typography></TableCell>
                                        <TableCell><Typography variant="body2" color="text.secondary">{r.time}</Typography></TableCell>
                                        <TableCell><Typography variant="body2">{r.duration}</Typography></TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={700} color="#448AFF">{r.total} ₺</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip size="small" label={sc.label}
                                                sx={{ bgcolor: sc.bg, color: sc.color, fontWeight: 700, height: 20, fontSize: '0.63rem' }} />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* ── Kiralama Modal ── */}
            <Dialog open={rentalModal} onClose={() => { setRentalModal(false); setSelected(null); }} maxWidth="xs" fullWidth
                PaperProps={{ sx: { bgcolor: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 } }}>
                <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                            width: 48, height: 48, borderRadius: 2, fontSize: '1.6rem',
                            bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>{selected?.emoji}</Box>
                        <Box>
                            <Typography fontWeight={800} sx={{ lineHeight: 1.2 }}>{selected?.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{selected?.brand} · {selected?.spec}</Typography>
                        </Box>
                    </Box>
                </DialogTitle>

                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
                    <TextField label="Tarih" size="small" fullWidth type="date"
                        value={form.date}
                        onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                        InputLabelProps={{ shrink: true }}
                        sx={{ '& .MuiOutlinedInput-root fieldset': { borderColor: 'rgba(255,255,255,0.12)' } }}
                    />
                    <FormControl size="small" fullWidth>
                        <InputLabel>Başlangıç Saati</InputLabel>
                        <Select value={form.time} label="Başlangıç Saati"
                            onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}>
                            {['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00'].map((t) => (
                                <MenuItem key={t} value={t}>{t}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl size="small" fullWidth>
                        <InputLabel>Süre</InputLabel>
                        <Select value={form.duration} label="Süre"
                            onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}>
                            {[1, 2, 3, 4].map((d) => (
                                <MenuItem key={d} value={d}>{d} saat — {selected ? selected.pricePerHour * d : 0} ₺</MenuItem>
                            ))}
                            <MenuItem value="day">Tam Gün — {selected?.pricePerDay ?? 0} ₺</MenuItem>
                        </Select>
                    </FormControl>

                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(0,230,118,0.05)', border: '1px solid rgba(0,230,118,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="caption" color="text.secondary">Toplam Tutar</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                                <CheckCircleOutlineIcon sx={{ color: '#00E676', fontSize: 15 }} />
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                                    {form.duration === 'day' ? 'Tam gün' : `${form.duration} saat · ${form.time}`}
                                </Typography>
                            </Box>
                        </Box>
                        <Typography variant="h5" fontWeight={800} color="primary.main">{totalPrice} ₺</Typography>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                    <Button onClick={() => { setRentalModal(false); setSelected(null); }}
                        sx={{ color: 'text.secondary', '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' } }}>
                        İptal
                    </Button>
                    <Button variant="contained" onClick={handleRent} disabled={!form.date}
                        sx={{ bgcolor: '#00E676', color: '#000', fontWeight: 700, '&:hover': { bgcolor: '#69F0AE' }, '&.Mui-disabled': { bgcolor: 'rgba(0,230,118,0.2)', color: 'rgba(0,0,0,0.4)' } }}>
                        Kirala
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
