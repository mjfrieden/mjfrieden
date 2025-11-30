import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h3" gutterBottom>White Cloud Medical – VaxPass</Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Secure digital immunization wallet with SMART Health Card support.
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Button variant="contained" size="large" onClick={() => navigate('/auth')}>Get My VaxPass</Button>
      </Box>
    </Container>
  );
}
