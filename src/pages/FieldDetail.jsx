import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Box, Container, Typography, Grid, Card, CardContent, Chip, Stack,
    Button, Avatar, Divider, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Snackbar, Alert, IconButton,
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
import { fields } from '../data/fields';
import { reservations } from '../data/reservations';
import { getWeather, getWeekForecast } from '../data/weather';

export default function FieldDetail() {
    const { id } = useParams();
    const field = fields.find((f) => f.id === Number(id));
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [bookingDialog, setBookingDialog] = useState(false);
    const [selectedHour, setSelectedHour] = useState(null);
    const [snackbar, setSnackbar] = useState(false);

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
    };

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
            <Dialog open={bookingDialog} onClose={() => setBookingDialog(false)} maxWidth="sm" fullWidth
                PaperProps={{ sx: { backgroundColor: 'background.paper', backgroundImage: 'none' } }}
            >
                <DialogTitle sx={{ fontWeight: 700 }}>
                    Rezervasyon Onayla
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ py: 2 }}>
                        <Stack spacing={2}>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Saha</Typography>
                                <Typography variant="body1" fontWeight={600}>{field.name}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Tarih</Typography>
                                <Typography variant="body1" fontWeight={600}>{selectedDate}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Saat</Typography>
                                <Typography variant="body1" fontWeight={600}>{selectedHour}:00 - {selectedHour + 1}:00</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Ücret</Typography>
                                <Typography variant="h5" fontWeight={800} color="primary.main">{field.pricePerHour} ₺</Typography>
                            </Box>
                            <TextField label="Takım Adı (Opsiyonel)" size="small" fullWidth />
                            <TextField label="Notlar" size="small" fullWidth multiline rows={2} />
                        </Stack>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => setBookingDialog(false)} color="inherit">İptal</Button>
                    <Button variant="contained" onClick={handleBook}>Rezervasyonu Onayla</Button>
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
