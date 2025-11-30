import { useState } from 'react';
import { Container, TextField, Button, Typography, Stack } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const saveToken = (token: string) => {
    localStorage.setItem('token', token);
  };

  const handleAction = async (path: string) => {
    try {
      const res = await axios.post(`/api/auth/${path}`, { email, password });
      saveToken(res.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  const demoLogin = async () => {
    const res = await axios.post('/api/auth/demo');
    saveToken(res.data.token);
    navigate('/dashboard');
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>Access VaxPass</Typography>
      <Stack spacing={2}>
        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" onClick={() => handleAction('login')}>Login</Button>
        <Button variant="outlined" onClick={() => handleAction('register')}>Sign Up</Button>
        <Button variant="text" onClick={demoLogin}>Try Demo Patient</Button>
      </Stack>
    </Container>
  );
}
