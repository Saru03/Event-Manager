import React from 'react'
import Button from '@mui/material/Button';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

const API_URL = import.meta.env.PROD
    ? 'https://event-manager-oicx.onrender.com'
    : 'http://localhost:3000';

const providers = [
    { id: 'google', name: 'Google' },
  ];

  const signIn = (provider) => {
    window.location.href = `${API_URL}/auth/google`;
    navigate('/events')
  };
  
  
function Login() {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <>
        <AppProvider theme={theme} >
        <SignInPage signIn={signIn} providers={providers} />
        </AppProvider>
        </>
        
    )
}

export default Login