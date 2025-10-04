// src/components/ResponsiveSection.jsx
import { Grid, Paper, Typography } from "@mui/material";

export default function ResponsiveSection() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography>Left Panel</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography>Right Panel</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}
