'use client'
import { Grid, Box } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import CreatedSEOBannersPage from '../components/seo-banners/CreatedSEOBannersPage';

const Dashboard = () => {
  return (
    <PageContainer title="Created SEO Banners" description="created seo banners">
      <Box>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 12 }}>
            <CreatedSEOBannersPage />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}

export default Dashboard;
