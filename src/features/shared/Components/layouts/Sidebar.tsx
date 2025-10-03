import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';  
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Divider from '@mui/material/Divider';
import { Link } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const drawerWidth = 240;
const pages = ['Dashboard', 'Transactions', 'Categories'];

const theme = createTheme({
  palette: {
    secondary: { main: '#c9bff5ff' }, 
  },
});

export const Sidebar = () => {
  
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  // Contenido del sidebar
  const drawer = (
    <Box sx={{ p: 2, }}>
      <Typography variant="h6" sx={{ mb: 25 }}>LOGO</Typography>
      {pages.map((page) => (
        <Button
          key={page}
          component={Link}            
          to={`/${page.toLowerCase()}`}
          sx={{ width: '100%', justifyContent: 'flex-start', mb: 4,
              color: 'Black',
          }}
        >
          {page}
        </Button>
      ))}
      <Divider />
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
    <Box sx={{ display: 'flex',}}>
      {/* AppBar superior solo en mobile */}
      <AppBar
        position="static"
        sx={{ display: { sm: 'none' }, bgcolor: 'secondary.main' }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6"></Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer (sidebar) */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        {/* Drawer para mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth,
              bgcolor: 'secondary.main',  
              color: 'Black'
             },
          }}
        >
          {drawer}
        </Drawer>

        {/* Drawer para desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth,
              bgcolor: 'secondary.main',  
              color: 'Black ',              
             },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
    </Box>
    </ThemeProvider>
  );
};
