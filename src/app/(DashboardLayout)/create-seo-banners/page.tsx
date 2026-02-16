'use client'
import { Grid, Box } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
// components

import CreateSEOBannersForm from '../components/forms/theme-elements/CreateSEOBannersForm';
const Dashboard = () => {
  return (
    <PageContainer title="Create SEO Banner" description="create seo banner">
      <Box>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 12 }}>
            <CreateSEOBannersForm />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}

export default Dashboard;
