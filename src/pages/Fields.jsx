import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Box, Container, Typography, Grid, Card, CardContent, CardMedia,
    TextField, MenuItem, Chip, Stack, InputAdornment, Rating,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import GroupIcon from '@mui/icons-material/Group';
import { fields, cities } from '../data/fields';

export default function Fields() {
    const [search, setSearch] = useState('');
    const [cityFilter, setCityFilter] = useState('');
    const [sortBy, setSortBy] = useState('rating');

    const filtered = fields
        .filter((f) => {
            const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
                f.district.toLowerCase().includes(search.toLowerCase());
            const matchCity = !cityFilter || f.city === cityFilter;
            return matchSearch && matchCity;
        })
        .sort((a, b) => {
            if (sortBy === 'rating') return b.rating - a.rating;
            if (sortBy === 'price_low') return a.pricePerHour - b.pricePerHour;
            if (sortBy === 'price_high') return b.pricePerHour - a.pricePerHour;
            return 0;
        });

    return (
        <Box sx={{ minHeight: '100vh', pt: 4, pb: 8 }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ mb: 5 }}>
                    <Typography variant="h3" fontWeight={800} gutterBottom>
                        Halı Sahalar
                    </Typography>
                    <Typography variant="h6" color="text.secondary" fontWeight={400}>
                        Şehrindeki en iyi sahaları keşfet ve hemen rezervasyon yap
                    </Typography>
                </Box>

                {/* Filters */}
                <Card sx={{ p: 3, mb: 5 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid size={{ xs: 12, md: 5 }}>
                            <TextField
                                fullWidth
                                placeholder="Saha adı veya ilçe ara..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                size="small"
                            />
                        </Grid>
                        <Grid size={{ xs: 6, md: 3.5 }}>
                            <TextField
                                select
                                fullWidth
                                label="Şehir"
                                value={cityFilter}
                                onChange={(e) => setCityFilter(e.target.value)}
                                size="small"
                            >
                                <MenuItem value="">Tüm Şehirler</MenuItem>
                                {cities.map((c) => (
                                    <MenuItem key={c} value={c}>{c}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 6, md: 3.5 }}>
                            <TextField
                                select
                                fullWidth
                                label="Sıralama"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                size="small"
                            >
                                <MenuItem value="rating">En Yüksek Puan</MenuItem>
                                <MenuItem value="price_low">En Düşük Fiyat</MenuItem>
                                <MenuItem value="price_high">En Yüksek Fiyat</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>
                </Card>

                {/* Results count */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {filtered.length} saha bulundu
                </Typography>

                {/* Field Grid */}
                <Grid container spacing={3}>
                    {filtered.map((field) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={field.id}>
                            <Card
                                component={Link}
                                to={`/field/${field.id}`}
                                sx={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%' }}
                            >
                                <Box sx={{ position: 'relative' }}>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={field.image}
                                        alt={field.name}
                                        sx={{ objectFit: 'cover' }}
                                    />
                                    <Chip
                                        label={`${field.pricePerHour} ₺/saat`}
                                        sx={{
                                            position: 'absolute', top: 12, right: 12,
                                            backgroundColor: 'rgba(0,0,0,0.75)',
                                            color: '#00E676',
                                            fontWeight: 700,
                                            backdropFilter: 'blur(10px)',
                                        }}
                                    />
                                </Box>
                                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="h6" fontWeight={700} gutterBottom>
                                        {field.name}
                                    </Typography>
                                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1.5 }}>
                                        <LocationOnIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {field.district}, {field.city}
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
                                        <Chip label={field.surface} size="small" variant="outlined" sx={{ fontSize: '0.75rem' }} />
                                        <Chip label={field.size} size="small" variant="outlined" sx={{ fontSize: '0.75rem' }} />
                                        <Chip
                                            icon={<GroupIcon sx={{ fontSize: 14 }} />}
                                            label={field.capacity}
                                            size="small"
                                            variant="outlined"
                                            sx={{ fontSize: '0.75rem' }}
                                        />
                                    </Stack>
                                    <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                            <StarIcon sx={{ fontSize: 18, color: '#FFD600' }} />
                                            <Typography variant="body2" fontWeight={700}>{field.rating}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                ({field.reviewCount})
                                            </Typography>
                                        </Stack>
                                        <Typography variant="caption" color="text.secondary">
                                            {field.openHour}:00 - {field.closeHour}:00
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {filtered.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 10 }}>
                        <Typography variant="h5" color="text.secondary">
                            Aradığınız kriterlere uygun saha bulunamadı.
                        </Typography>
                    </Box>
                )}
            </Container>
        </Box>
    );
}
