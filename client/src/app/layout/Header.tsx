import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Switch from '@mui/material/Switch';
import Badge from '@mui/material/Badge';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { IconButton } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useStoreContext } from '../context/StoreContext';
import { Link } from 'react-router-dom';
const label = { inputProps: { 'aria-label': 'Color switch demo' } };
const midLinks = [ 
  { title: "catalog", path: "/catalog" }, 
  { title: "about", path: "/about" }, 
  { title: "contact", path: "/contact" }, 
]; 

const rightLinks = [ 
  { title: "login", path: "/login" }, 
  { title: "register", path: "/register" }, 
];

const navStyles = { 
  color: "inherit", 
  textDecoration: "none", 
  typography: "h6", 
  "&:hover": { 
    color: "grey.500", 
  }, 
  "&.active": { 
    color: "text.secondary", 
  }, 
}; 

const Header = (props: any) => {

  const { basket } = useStoreContext();
  const itemCount = basket?.items.reduce((sum, item) => sum + item.quantity, 0);



  return (
    <>
      <Box sx={{ flexGrow: 1, mb: 5 }}>
        <AppBar position="static">
          <Toolbar sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }} >

            <Box sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <Switch {...label} defaultChecked color="warning" onChange={props.handleMode} />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                BUAKAW-STORE
              </Typography>
            </Box>
          
            <Box >
              <List sx={{ display: "flex" }}>
                {midLinks.map(({title , path})=>( 
                <ListItem component={NavLink} to={path} sx={navStyles} key={title}>
                   {title.toUpperCase()}
                </ListItem>
              ))}
              </List>
            </Box>
            <Box  sx={{ display: "flex" }}>
              <IconButton component={Link} to="/basket" size='large' color='inherit' >
              <Badge badgeContent={itemCount} color="error" sx={{ mr:"4px" }}>
                <ShoppingCartIcon />
              </Badge>
              </IconButton>
             
              <List sx={{ display: "flex" }}>
                {rightLinks.map(({title , path})=>( 
                <ListItem component={NavLink} to={path} sx={navStyles} key={title}>
                   {title.toUpperCase()}
                </ListItem>
              ))}
              </List>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  )
}



export default Header