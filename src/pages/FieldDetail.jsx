import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Box, Container, Typography, Grid, Card, CardContent, Chip, Stack,
    Button, Avatar, Divider, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Snackbar, Alert, IconButton, Select, MenuItem, InputLabel, FormControl,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AirIcon from '@mui/icons-material/Air';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { fields } from '../data/fields';
import { reservations } from '../data/reservations';
import { getWeather, getWeekForecast } from '../data/weather';
import { rentalProducts, fieldInventory } from '../data/rentals';
import { allPackages, fieldPackages, PACKAGE_CATEGORIES } from '../data/packages';

export default function FieldDetail() {
    const { id } = useParams();
    const field = fields.find((f) => f.id === Number(id));
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [bookingDialog, setBookingDialog] = useState(false);
    const [selectedHour, setSelectedHour] = useState(null);
    const [snackbar, setSnackbar] = useState(false);
    const [selectedPackages, setSelectedPackages] = useState([]);
    const [rentalModal, setRentalModal] = useState(false);
    const [selectedRental, setSelectedRental] = useState(null);
    const [rentalForm, setRentalForm] = useState({ date: '', time: '18:00', duration: 2 });

    const weather = useMemo(() => field ? getWeather(field.city, selectedDate) : null, [field, selectedDate]);
    const forecast = useMemo(() => field ? getWeekForecast(field.city) : [], [field]);

    if (!field) {
        return (
            <Container sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h4">Saha bulunamadı</Typography>
            </Container>
        );
    }

    const hours = [];
    for (let h = field.openHour; h < field.closeHour; h++) {
        hours.push(h);
    }

    const dayReservations = reservations.filter(
        (r) => r.fieldId === field.id && r.date === selectedDate
    );
    const reservedHours = new Set(dayReservations.map((r) => r.hour));

    const dates = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        dates.push(d.toISOString().split('T')[0]);
    }

    const handleBook = () => {
        setBookingDialog(false);
        setSnackbar(true);
        setSelectedHour(null);
        setSelectedPackages([]);
    };

    const togglePackage = (id) =>
        setSelectedPackages((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);

    const availablePackages = (fieldPackages[field?.id] || []).map((pid) => allPackages.find((p) => p.id === pid)).filter(Boolean);
    const packagesTotal = selectedPackages.reduce((sum, pid) => {
        const pkg = allPackages.find((p) => p.id === pid);
        return sum + (pkg?.price || 0);
    }, 0);
    const bookingTotal = field ? field.pricePerHour + packagesTotal : 0;

    const fieldProducts = (fieldInventory[field?.id] ? Object.entries(fieldInventory[field.id]).map(([pid, stock]) => {
        const product = rentalProducts.find((p) => p.id === Number(pid));
        return product ? { ...product, stock } : null;
    }).filter(Boolean) : []);

    const rentalTotal = selectedRental
        ? (rentalForm.duration === 'day' ? selectedRental.pricePerDay : selectedRental.pricePerHour * Number(rentalForm.duration))
        : 0;

    return (
        <Box sx={{ minHeight: '100vh', pb: 8 }}>
            {/* Hero Image */}
            <Box
                sx={{
                    position: 'relative',
                    height: { xs: 250, md: 400 },
                    overflow: 'hidden',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(0deg, rgba(10,14,23,1) 0%, transparent 100%)',
                    },
                }}
            >
                <Box
                    component="img"
                    src={field.image}
                    alt={field.name}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <IconButton
                    component={Link}
                    to="/fields"
                    sx={{
                        position: 'absolute', top: 20, left: 20, zIndex: 2,
                        backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)',
                        color: '#fff',
                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                    }}
                >
                    <ArrowBackIcon />
                </IconButton>
            </Box>

            <Container maxWidth="lg" sx={{ mt: -8, position: 'relative', zIndex: 2 }}>
                <Grid container spacing={4}>
                    {/* Left: Info */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Box sx={{ mb: 4 }}>
                            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                                <Typography variant="h3" fontWeight={800}>{field.name}</Typography>
                                <Chip
                                    icon={<StarIcon sx={{ fontSize: 16 }} />}
                                    label={`${field.rating} (${field.reviewCount})`}
                                    sx={{ backgroundColor: 'rgba(255,214,0,0.12)', color: '#FFD600', fontWeight: 700 }}
                                />
                            </Stack>
                            <Stack direction="row" spacing={2} alignItems="center" color="text.secondary">
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                    <LocationOnIcon sx={{ fontSize: 18 }} />
                                    <Typography variant="body1">{field.address}, {field.district}/{field.city}</Typography>
                                </Stack>
                            </Stack>
                        </Box>

                        {/* Amenities */}
                        <Card sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom>Özellikler</Typography>
                            <Stack direction="row" flexWrap="wrap" gap={1}>
                                {field.amenities.map((a) => (
                                    <Chip key={a} label={a} variant="outlined" sx={{ borderColor: 'rgba(0,230,118,0.3)', color: 'primary.main' }} />
                                ))}
                            </Stack>
                            <Divider sx={{ my: 2 }} />
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Typography variant="caption" color="text.secondary">Zemin</Typography>
                                    <Typography variant="body1" fontWeight={600}>{field.surface}</Typography>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Typography variant="caption" color="text.secondary">Boyut</Typography>
                                    <Typography variant="body1" fontWeight={600}>{field.size}</Typography>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Typography variant="caption" color="text.secondary">Kapasite</Typography>
                                    <Typography variant="body1" fontWeight={600}>{field.capacity}</Typography>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Typography variant="caption" color="text.secondary">İletişim</Typography>
                                    <Typography variant="body1" fontWeight={600}>{field.phone}</Typography>
                                </Grid>
                            </Grid>
                        </Card>

                        {/* Reservation Calendar */}
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                Rezervasyon Yap
                            </Typography>

                            {/* Date picker */}
                            <Stack direction="row" spacing={1} sx={{ mb: 3, overflowX: 'auto', pb: 1 }}>
                                {dates.map((d) => {
                                    const dateObj = new Date(d);
                                    const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
                                    const isSelected = d === selectedDate;
                                    return (
                                        <Button
                                            key={d}
                                            variant={isSelected ? 'contained' : 'outlined'}
                                            onClick={() => setSelectedDate(d)}
                                            sx={{
                                                minWidth: 70,
                                                flexDirection: 'column',
                                                py: 1.5,
                                                borderColor: isSelected ? 'primary.main' : 'rgba(255,255,255,0.1)',
                                                color: isSelected ? 'primary.contrastText' : 'text.secondary',
                                            }}
                                        >
                                            <Typography variant="caption" fontWeight={600}>
                                                {dayNames[dateObj.getDay()]}
                                            </Typography>
                                            <Typography variant="body1" fontWeight={700}>
                                                {dateObj.getDate()}
                                            </Typography>
                                        </Button>
                                    );
                                })}
                            </Stack>

                            {/* Time slots */}
                            <Grid container spacing={1.5}>
                                {hours.map((h) => {
                                    const isReserved = reservedHours.has(h);
                                    return (
                                        <Grid size={{ xs: 4, sm: 3, md: 2 }} key={h}>
                                            <Button
                                                fullWidth
                                                variant={isReserved ? 'contained' : 'outlined'}
                                                disabled={isReserved}
                                                onClick={() => { setSelectedHour(h); setBookingDialog(true); }}
                                                sx={{
                                                    py: 2,
                                                    flexDirection: 'column',
                                                    borderColor: isReserved ? 'transparent' : 'rgba(255,255,255,0.1)',
                                                    backgroundColor: isReserved ? 'rgba(255,82,82,0.15)' : 'transparent',
                                                    color: isReserved ? '#FF5252' : 'text.primary',
                                                    '&:hover': isReserved ? {} : {
                                                        borderColor: 'primary.main',
                                                        backgroundColor: 'rgba(0,230,118,0.08)',
                                                    },
                                                    '&.Mui-disabled': {
                                                        color: '#FF5252',
                                                        borderColor: 'transparent',
                                                        backgroundColor: 'rgba(255,82,82,0.08)',
                                                    },
                                                }}
                                            >
                                                <Typography variant="body1" fontWeight={700}>{h}:00</Typography>
                                                <Stack direction="row" alignItems="center" spacing={0.3}>
                                                    {isReserved ? (
                                                        <>
                                                            <BlockIcon sx={{ fontSize: 12 }} />
                                                            <Typography variant="caption">Dolu</Typography>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircleIcon sx={{ fontSize: 12, color: 'primary.main' }} />
                                                            <Typography variant="caption" sx={{ color: 'primary.main' }}>Müsait</Typography>
                                                        </>
                                                    )}
                                                </Stack>
                                            </Button>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Card>
                        {/* Ekipman Kiralama */}
                        {fieldProducts.length > 0 && (
                            <Card sx={{ p: 3, mt: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <StorefrontIcon sx={{ color: '#00E676', fontSize: 22 }} />
                                        <Typography variant="h6" fontWeight={700}>Ekipman Kiralama</Typography>
                                    </Box>
                                    <Chip size="small" label={`${fieldProducts.length} ürün`}
                                        sx={{ bgcolor: 'rgba(0,230,118,0.1)', color: '#00E676', fontWeight: 700, fontSize: '0.7rem', height: 22 }} />
                                </Box>

                                <Grid container spacing={1.5}>
                                    {fieldProducts.map((product) => {
                                        const hasStock = product.stock > 0;
                                        return (
                                            <Grid key={product.id} size={{ xs: 6, sm: 4, md: 3 }}>
                                                <Box sx={{
                                                    p: 1.5, borderRadius: 2,
                                                    border: `1px solid ${hasStock ? 'rgba(255,255,255,0.07)' : 'rgba(255,82,82,0.12)'}`,
                                                    bgcolor: hasStock ? 'rgba(255,255,255,0.02)' : 'rgba(255,82,82,0.03)',
                                                    display: 'flex', flexDirection: 'column', gap: 0.75,
                                                    transition: 'all 0.2s',
                                                    '&:hover': hasStock ? { borderColor: 'rgba(0,230,118,0.25)', bgcolor: 'rgba(0,230,118,0.03)' } : {},
                                                }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <Box sx={{ fontSize: '1.4rem' }}>{product.emoji}</Box>
                                                        <Chip size="small"
                                                            label={product.stock === 0 ? 'Tükendi' : `${product.stock} adet`}
                                                            sx={{
                                                                bgcolor: product.stock === 0 ? 'rgba(255,82,82,0.12)' : product.stock <= 2 ? 'rgba(255,152,0,0.12)' : 'rgba(0,230,118,0.1)',
                                                                color: product.stock === 0 ? '#FF5252' : product.stock <= 2 ? '#FF9800' : '#00E676',
                                                                fontWeight: 700, fontSize: '0.58rem', height: 18,
                                                            }} />
                                                    </Box>
                                                    <Typography variant="body2" fontWeight={700} sx={{ fontSize: '0.8rem', lineHeight: 1.2 }}>
                                                        {product.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.62rem' }}>
                                                        {product.brand}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
                                                        <Box>
                                                            <Typography variant="body2" fontWeight={800} color="primary.main" sx={{ lineHeight: 1 }}>
                                                                {product.pricePerHour} ₺
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.57rem' }}>/saat</Typography>
                                                        </Box>
                                                        <Button size="small" disabled={!hasStock}
                                                            onClick={() => { setSelectedRental(product); setRentalModal(true); }}
                                                            sx={{
                                                                fontSize: '0.68rem', fontWeight: 700, py: 0.4, px: 1, minWidth: 0,
                                                                bgcolor: hasStock ? 'rgba(0,230,118,0.12)' : 'transparent',
                                                                color: hasStock ? '#00E676' : 'text.disabled',
                                                                border: `1px solid ${hasStock ? 'rgba(0,230,118,0.25)' : 'rgba(255,255,255,0.05)'}`,
                                                                '&:hover': { bgcolor: 'rgba(0,230,118,0.22)' },
                                                                '&.Mui-disabled': { color: 'rgba(255,255,255,0.2)' },
                                                            }}>
                                                            Kirala
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </Card>
                        )}
                    </Grid>

                    {/* Right: Weather + Info Card */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        {/* Weather Widget */}
                        <Card sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, rgba(68,138,255,0.1) 0%, rgba(0,230,118,0.05) 100%)' }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                Hava Durumu
                            </Typography>
                            {weather && (
                                <>
                                    <Box sx={{ textAlign: 'center', py: 2 }}>
                                        <Typography variant="h1" sx={{ fontSize: '3rem', mb: 0 }}>{weather.icon}</Typography>
                                        <Typography variant="h3" fontWeight={800}>{weather.temperature}°C</Typography>
                                        <Typography variant="body1" color="text.secondary">{weather.condition}</Typography>
                                    </Box>
                                    <Divider sx={{ my: 2 }} />
                                    <Grid container spacing={2}>
                                        <Grid size={4} sx={{ textAlign: 'center' }}>
                                            <ThermostatIcon sx={{ color: 'primary.main', mb: 0.5 }} />
                                            <Typography variant="caption" color="text.secondary" display="block">Hissedilen</Typography>
                                            <Typography variant="body2" fontWeight={600}>{weather.feelsLike}°C</Typography>
                                        </Grid>
                                        <Grid size={4} sx={{ textAlign: 'center' }}>
                                            <WaterDropIcon sx={{ color: '#448AFF', mb: 0.5 }} />
                                            <Typography variant="caption" color="text.secondary" display="block">Nem</Typography>
                                            <Typography variant="body2" fontWeight={600}>%{weather.humidity}</Typography>
                                        </Grid>
                                        <Grid size={4} sx={{ textAlign: 'center' }}>
                                            <AirIcon sx={{ color: '#94A3B8', mb: 0.5 }} />
                                            <Typography variant="caption" color="text.secondary" display="block">Rüzgar</Typography>
                                            <Typography variant="body2" fontWeight={600}>{weather.wind} km/s</Typography>
                                        </Grid>
                                    </Grid>
                                </>
                            )}
                            {/* Week forecast */}
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>7 Günlük Tahmin</Typography>
                            <Stack spacing={1}>
                                {forecast.map((day) => (
                                    <Stack
                                        key={day.date}
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{
                                            py: 0.8, px: 1.5, borderRadius: 1,
                                            backgroundColor: day.date === selectedDate ? 'rgba(0,230,118,0.08)' : 'transparent',
                                            cursor: 'pointer',
                                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.03)' },
                                        }}
                                        onClick={() => setSelectedDate(day.date)}
                                    >
                                        <Typography variant="body2" fontWeight={600} sx={{ minWidth: 35 }}>{day.dayName}</Typography>
                                        <Typography>{day.icon}</Typography>
                                        <Typography variant="body2" fontWeight={600}>{day.temperature}°</Typography>
                                    </Stack>
                                ))}
                            </Stack>
                        </Card>

                        {/* Price Card */}
                        <Card sx={{ p: 3, textAlign: 'center', border: '1px solid rgba(0,230,118,0.2)' }}>
                            <Typography variant="body2" color="text.secondary">Saatlik Ücret</Typography>
                            <Typography variant="h3" fontWeight={800} color="primary.main" sx={{ my: 1 }}>
                                {field.pricePerHour} ₺
                            </Typography>
                            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                                <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                    {field.openHour}:00 - {field.closeHour}:00
                                </Typography>
                            </Stack>
                            <Divider sx={{ my: 2 }} />
                            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                                <PhoneIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                                <Typography variant="body2" fontWeight={600}>{field.phone}</Typography>
                            </Stack>
                        </Card>
                    </Grid>
                </Grid>
            </Container>

            {/* Booking Dialog */}
            <Dialog open={bookingDialog} onClose={() => { setBookingDialog(false); setSelectedPackages([]); }} maxWidth="sm" fullWidth
                PaperProps={{ sx: { bgcolor: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, backgroundImage: 'none' } }}
            >
                <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Rezervasyon Onayla</DialogTitle>
                <DialogContent sx={{ pt: '8px !important' }}>
                    <Stack spacing={2}>
                        {/* Özet bilgiler */}
                        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                            {[
                                { label: 'Saha',  value: field.name },
                                { label: 'Tarih', value: selectedDate },
                                { label: 'Saat',  value: `${selectedHour}:00 – ${selectedHour + 1}:00` },
                            ].map((item) => (
                                <Box key={item.label} sx={{ flex: 1, minWidth: 120, p: 1.25, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.63rem' }}>{item.label}</Typography>
                                    <Typography variant="body2" fontWeight={700}>{item.value}</Typography>
                                </Box>
                            ))}
                        </Box>

                        <TextField label="Takım Adı (Opsiyonel)" size="small" fullWidth
                            sx={{ '& .MuiOutlinedInput-root fieldset': { borderColor: 'rgba(255,255,255,0.12)' } }} />
                        <TextField label="Notlar" size="small" fullWidth multiline rows={2}
                            sx={{ '& .MuiOutlinedInput-root fieldset': { borderColor: 'rgba(255,255,255,0.12)' } }} />

                        {/* Paketler */}
                        {availablePackages.length > 0 && (
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25 }}>
                                    <Typography variant="body2" fontWeight={700}>Paket Ekle</Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                                        — opsiyonel, rezervasyona dahil edilir
                                    </Typography>
                                </Box>
                                <Stack spacing={0.75}>
                                    {availablePackages.map((pkg) => {
                                        const isSelected = selectedPackages.includes(pkg.id);
                                        const cat = PACKAGE_CATEGORIES[pkg.category];
                                        return (
                                            <Box key={pkg.id} onClick={() => togglePackage(pkg.id)} sx={{
                                                display: 'flex', alignItems: 'center', gap: 1.5,
                                                p: 1.25, borderRadius: 2, cursor: 'pointer',
                                                bgcolor: isSelected ? `${cat.color}10` : 'rgba(255,255,255,0.02)',
                                                border: `1px solid ${isSelected ? cat.color + '40' : 'rgba(255,255,255,0.06)'}`,
                                                transition: 'all 0.18s',
                                                '&:hover': { borderColor: cat.color + '50', bgcolor: `${cat.color}08` },
                                            }}>
                                                {/* Checkbox */}
                                                <Box sx={{
                                                    width: 20, height: 20, borderRadius: 0.75, flexShrink: 0,
                                                    border: `2px solid ${isSelected ? cat.color : 'rgba(255,255,255,0.2)'}`,
                                                    bgcolor: isSelected ? cat.color : 'transparent',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    transition: 'all 0.18s',
                                                }}>
                                                    {isSelected && <Box sx={{ width: 5, height: 9, border: '2px solid #000', borderTop: 'none', borderLeft: 'none', transform: 'rotate(45deg) translate(-1px, -1px)' }} />}
                                                </Box>
                                                <Box sx={{ fontSize: '1.2rem', flexShrink: 0 }}>{pkg.emoji}</Box>
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                                        <Typography variant="body2" fontWeight={700} sx={{ fontSize: '0.82rem' }}>{pkg.name}</Typography>
                                                        {pkg.badge && (
                                                            <Chip size="small" label={pkg.badge} sx={{
                                                                height: 16, fontSize: '0.55rem', fontWeight: 700,
                                                                bgcolor: pkg.badge === 'Ücretsiz' ? 'rgba(0,230,118,0.15)' : pkg.badge === 'Popüler' ? 'rgba(255,152,0,0.15)' : 'rgba(68,138,255,0.15)',
                                                                color: pkg.badge === 'Ücretsiz' ? '#00E676' : pkg.badge === 'Popüler' ? '#FF9800' : '#448AFF',
                                                            }} />
                                                        )}
                                                        <Chip size="small" label={cat.label} sx={{
                                                            height: 16, fontSize: '0.55rem', fontWeight: 600,
                                                            bgcolor: `${cat.color}12`, color: cat.color,
                                                        }} />
                                                    </Box>
                                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>{pkg.desc}</Typography>
                                                </Box>
                                                <Typography variant="body2" fontWeight={800}
                                                    sx={{ color: pkg.price === 0 ? '#00E676' : 'text.primary', flexShrink: 0 }}>
                                                    {pkg.price === 0 ? 'Ücretsiz' : `+${pkg.price} ₺`}
                                                </Typography>
                                            </Box>
                                        );
                                    })}
                                </Stack>
                            </Box>
                        )}

                        {/* Toplam */}
                        <Box sx={{ p: 1.75, borderRadius: 2, bgcolor: 'rgba(0,230,118,0.05)', border: '1px solid rgba(0,230,118,0.18)' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: packagesTotal > 0 ? 0.75 : 0 }}>
                                <Typography variant="body2" color="text.secondary">Saha ücreti</Typography>
                                <Typography variant="body2" fontWeight={600}>{field.pricePerHour} ₺</Typography>
                            </Box>
                            {packagesTotal > 0 && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Paketler ({selectedPackages.length} adet)
                                    </Typography>
                                    <Typography variant="body2" fontWeight={600}>+{packagesTotal} ₺</Typography>
                                </Box>
                            )}
                            {packagesTotal > 0 && <Divider sx={{ borderColor: 'rgba(0,230,118,0.15)', mb: 0.75 }} />}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body1" fontWeight={700}>Toplam</Typography>
                                <Typography variant="h5" fontWeight={800} color="primary.main">{bookingTotal} ₺</Typography>
                            </Box>
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                    <Button onClick={() => { setBookingDialog(false); setSelectedPackages([]); }} color="inherit">İptal</Button>
                    <Button variant="contained" onClick={handleBook}>Rezervasyonu Onayla</Button>
                </DialogActions>
            </Dialog>

            {/* Ekipman Kiralama Modal */}
            <Dialog open={rentalModal} onClose={() => { setRentalModal(false); setSelectedRental(null); }} maxWidth="xs" fullWidth
                PaperProps={{ sx: { bgcolor: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 } }}>
                <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                            width: 46, height: 46, borderRadius: 2, fontSize: '1.5rem',
                            bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>{selectedRental?.emoji}</Box>
                        <Box>
                            <Typography fontWeight={800} sx={{ lineHeight: 1.2 }}>{selectedRental?.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{selectedRental?.brand} · {field.name}</Typography>
                        </Box>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
                    <TextField label="Tarih" size="small" fullWidth type="date"
                        value={rentalForm.date}
                        onChange={(e) => setRentalForm((p) => ({ ...p, date: e.target.value }))}
                        InputLabelProps={{ shrink: true }}
                        sx={{ '& .MuiOutlinedInput-root fieldset': { borderColor: 'rgba(255,255,255,0.12)' } }}
                    />
                    <FormControl size="small" fullWidth>
                        <InputLabel>Başlangıç Saati</InputLabel>
                        <Select value={rentalForm.time} label="Başlangıç Saati"
                            onChange={(e) => setRentalForm((p) => ({ ...p, time: e.target.value }))}>
                            {['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00'].map((t) => (
                                <MenuItem key={t} value={t}>{t}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl size="small" fullWidth>
                        <InputLabel>Süre</InputLabel>
                        <Select value={rentalForm.duration} label="Süre"
                            onChange={(e) => setRentalForm((p) => ({ ...p, duration: e.target.value }))}>
                            {[1, 2, 3, 4].map((d) => (
                                <MenuItem key={d} value={d}>{d} saat — {selectedRental ? selectedRental.pricePerHour * d : 0} ₺</MenuItem>
                            ))}
                            <MenuItem value="day">Tam Gün — {selectedRental?.pricePerDay ?? 0} ₺</MenuItem>
                        </Select>
                    </FormControl>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(0,230,118,0.05)', border: '1px solid rgba(0,230,118,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">Toplam Tutar</Typography>
                        <Typography variant="h5" fontWeight={800} color="primary.main">{rentalTotal} ₺</Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                    <Button onClick={() => { setRentalModal(false); setSelectedRental(null); }}
                        sx={{ color: 'text.secondary', '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' } }}>
                        İptal
                    </Button>
                    <Button variant="contained" disabled={!rentalForm.date} onClick={() => { setRentalModal(false); setSnackbar(true); setSelectedRental(null); }}
                        sx={{ bgcolor: '#00E676', color: '#000', fontWeight: 700, '&:hover': { bgcolor: '#69F0AE' } }}>
                        Kirala
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar open={snackbar} autoHideDuration={4000} onClose={() => setSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" variant="filled" onClose={() => setSnackbar(false)}>
                    Rezervasyonunuz başarıyla oluşturuldu! 🎉
                </Alert>
            </Snackbar>
        </Box>
    );
}
