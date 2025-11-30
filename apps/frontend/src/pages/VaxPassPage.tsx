import { useState } from 'react';
import { Container, Typography, Button, Card, CardContent, Stack, TextField } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function VaxPassPage() {
  const [numeric, setNumeric] = useState('');
  const [jws, setJws] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const generate = async () => {
    if (!token) return navigate('/auth');
    const res = await axios.post('/api/shc', {}, { headers: { Authorization: `Bearer ${token}` } });
    setNumeric(res.data.numeric);
    setJws(res.data.jws);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>My VaxPass</Typography>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography>Generate a SMART Health Card QR to add to Apple Wallet or Google Wallet.</Typography>
            <Button variant="contained" onClick={generate}>Generate Smart Health Card</Button>
            {numeric && (
              <Stack spacing={1}>
                <Typography variant="h6">QR Code</Typography>
                <img alt="SHC QR" src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(numeric)}`} />
                <TextField label="Numeric Payload" multiline value={numeric} InputProps={{ readOnly: true }} />
                <Button variant="outlined" onClick={() => navigator.clipboard.writeText(jws)}>Copy JWS Payload</Button>
                <Button variant="text" onClick={() => navigator.clipboard.writeText(numeric)}>Copy SHC Numeric</Button>
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
