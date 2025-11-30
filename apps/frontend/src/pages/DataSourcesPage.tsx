import { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Button, Grid, Chip } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Connection {
  id: string;
  type: string;
  status: string;
  demoMode: boolean;
}

const labels: Record<string, string> = {
  state_iis: 'State Immunization Registry',
  smart_on_fhir: 'My Doctor / Health System',
  pharmacy: 'Pharmacy',
};

export default function DataSourcesPage() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const load = async () => {
    if (!token) return navigate('/auth');
    const res = await axios.get('/api/sources', { headers: { Authorization: `Bearer ${token}` } });
    setConnections(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const connect = async (id: string) => {
    await axios.post(`/api/sources/${id}/connect`, {}, { headers: { Authorization: `Bearer ${token}` } });
    load();
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Data Sources</Typography>
      <Grid container spacing={2}>
        {connections.map((c) => (
          <Grid item xs={12} sm={6} key={c.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{labels[c.type] || c.type}</Typography>
                <Chip label={c.demoMode ? 'Demo Mode' : 'Live Ready'} sx={{ mt: 1 }} />
                <Typography color="text.secondary" sx={{ mt: 1 }}>Status: {c.status}</Typography>
                <Button variant="contained" sx={{ mt: 2 }} onClick={() => connect(c.type)}>Connect</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
