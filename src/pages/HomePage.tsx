import { Box, Container, Typography } from '@mui/material';
import { BioEQForm } from '../components/BioEQForm';

export const HomePage = () => (
  <Box sx={{ py: { xs: 4, md: 8 } }}>
    <Container maxWidth="lg">
      <Box textAlign="center" mb={5}>
        <Typography variant="h3" mb={1}>
          BioEQ
        </Typography>
        <Typography variant="h6" color="text.secondary">
          AI-инструмент для проектирования исследований биоэквивалентности
        </Typography>
      </Box>
      <BioEQForm />
    </Container>
  </Box>
);
