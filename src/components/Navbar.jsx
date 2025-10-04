// src/pages/Login.jsx
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, TextField, Typography, Alert, Paper } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { loginApi } from '../api/auth';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    try {
      const res = await loginApi(data);
      login(res.token, res.user);
      navigate(from, { replace: true });
    } catch (err) {
      if (err?.fieldErrors) {
        Object.entries(err.fieldErrors).forEach(([field, message]) =>
          setError(field, { type: 'server', message })
        );
      } else {
        setError('root', { type: 'server', message: err?.message || 'Login failed' });
     }
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 4, md: 8 } }}>
      <Paper sx={{ p: 3, width: '100%', maxWidth: 420 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Login</Typography>

        {errors.root?.message && <Alert severity="error">{errors.root.message}</Alert>}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
