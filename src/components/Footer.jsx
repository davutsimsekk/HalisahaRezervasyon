import { Box, Container, Typography, IconButton, Stack } from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

export default function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                mt: 'auto',
                py: 4,
                px: 2,
                borderTop: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(10, 14, 23, 0.9)',
            }}
        >
            <Container maxWidth="xl">
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SportsSoccerIcon sx={{ color: 'primary.main' }} />
                        <Typography
                            variant="h6"
                            fontWeight={800}
                            sx={{
                                background: 'linear-gradient(135deg, #00E676, #448AFF)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            HalıSaha+
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        © 2026 HalıSaha+. Tüm hakları saklıdır.
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        <IconButton size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                            <GitHubIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                            <TwitterIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                            <InstagramIcon fontSize="small" />
                        </IconButton>
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
}
