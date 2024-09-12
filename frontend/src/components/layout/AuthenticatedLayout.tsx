import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AppBar, Toolbar, Typography, Box, Container, styled } from '@mui/material';
import { Link } from 'react-router-dom';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const StyledLink = styled(Link)`
    text-decoration: none;
    color: inherit;

    &:focus, &:hover, &:visited, &:link, &:active {
        text-decoration: none;
    }
`;

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between"}}>
          <Typography component={StyledLink} to={'/'} variant="h6">
            Welcome Collective
          </Typography>
          <div style={{ display: "flex" }}>
            {user!.role == 'Admin' ? (
              <>
                <Typography component={StyledLink} to={'/admin'} sx={{ marginRight: "3rem", }} variant="button">
                  Admin Portal
                </Typography>
                <Typography variant="button" onClick={logout} sx={{ cursor: 'pointer' }}>
                  Logout
                </Typography>
              </>
            ) : (
              <Typography variant="button" onClick={logout} sx={{ cursor: 'pointer' }}>
                Logout
              </Typography>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ flexGrow: 1, py: 2 }}>
        {children}
      </Container>
    </Box>
  );
};

export default AuthenticatedLayout;