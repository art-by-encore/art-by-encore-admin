'use client'
import { Grid, Box } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import CreatedPortfolioPage from '../components/portfolio/CreatedPortfolioPage';
const Dashboard = () => {
  return (
    <PageContainer title="Created Portfolios" description="created portfolios">
      <Box>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 12 }}>
            <CreatedPortfolioPage />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}

export default Dashboard;
