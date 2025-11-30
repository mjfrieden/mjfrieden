import { useEffect, useState } from 'react';
import { Container, Typography, Button, Grid, Card, CardContent, List, ListItem, ListItemText, Stack } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Connection {
  id: string;
  type: string;
  status: string;
  demoMode: boolean;
}

interface Immunization {
  vaccineCode: { text?: string; coding?: { display?: string }[] };
  occurrenceDateTime?: string;
}

export default function DashboardPage() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [immunizations, setImmunizations] = useState<Immunization[]>([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/auth');
      return;
    }
    axios.get('/api/sources', { headers: { Authorization: `Bearer ${token}` } }).then((res) => setConnections(res.data));
    axios.get('/api/immunizations', { headers: { Authorization: `Bearer ${token}` } }).then((res) => setImmunizations(res.data));
  }, [token, navigate]);

  const sync = async () => {
    await axios.post('/api/sync', {}, { headers: { Authorization: `Bearer ${token}` } });
    const res = await axios.get('/api/immunizations', { headers: { Authorization: `Bearer ${token}` } });
    setImmunizations(res.data);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Dashboard</Typography>
        <Button variant="outlined" onClick={() => navigate('/vaxpass')}>My VaxPass</Button>
      </Stack>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Data Sources</Typography>
                <Button onClick={() => navigate('/sources')}>Manage</Button>
              </Stack>
              <List>
                {connections.map((c) => (
                  <ListItem key={c.id}>
                    <ListItemText primary={c.type} secondary={`${c.status} ${c.demoMode ? '(demo)' : ''}`} />
                  </ListItem>
                ))}
              </List>
              <Button variant="contained" onClick={sync}>Sync My Immunizations</Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Immunization Timeline</Typography>
              <List>
                {immunizations.map((im, idx) => (
                  <ListItem key={idx}>
                    <ListItemText primary={im.vaccineCode.coding?.[0]?.display || im.vaccineCode.text} secondary={im.occurrenceDateTime} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
