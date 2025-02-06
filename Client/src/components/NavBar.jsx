import React, { useContext, useEffect, useState } from 'react'
import { logo } from '../../public'
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../helpers/AuthContext';

function NavBar() {
  const { url } = useContext(AuthContext);
  const [state, setState] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [admin, setAdmin] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState(open);
  };

  useEffect(() => {
    if (sessionStorage.getItem("adminAccessToken")) {
      axios.get(`${url}/admin`, {
        headers: {
          "Authorization": `Bearer ${sessionStorage.getItem("adminAccessToken")}`
        }
      }).then((response) => {
        if (!response.data.error) {
          setAdmin(true);
        }
      })
    }
    else if (sessionStorage.getItem("userAccessToken")) {
      axios.get(`${url}/user`, {
        headers: {
          "Authorization": `Bearer ${sessionStorage.getItem("userAccessToken")}`
        }
      }).then((response) => {
        if (!response.data.error) {
          setIsUser(true)
        }
      })
    }
  }, [])

  const handleLogout = () => {
    sessionStorage.removeItem("adminAccessToken");
    sessionStorage.removeItem("userAccessToken");
    navigate("/user/login")
  }

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250, color: "white", backgroundColor: "#052e16", height: "100vh" }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <ListItem>
        <ListItemText>
          <div>
            <img src={logo} alt="logo.png" />
          </div>
        </ListItemText>
      </ListItem>
      {admin && (
        <>
          <List>
            <Link to="/admin">
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon sx={{ color: "white" }}>
                    <MailIcon />
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItemButton>
              </ListItem>
            </Link>
            <Link to="/admin/addHospital">
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon sx={{ color: "white" }}>
                    <MailIcon />
                  </ListItemIcon>
                  <ListItemText primary="Add Hospital" />
                </ListItemButton>
              </ListItem>
            </Link>
            <Link to="/admin/hospital/view">
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon sx={{ color: "white" }}>
                    <MailIcon />
                  </ListItemIcon>
                  <ListItemText primary="View Hospitals" />
                </ListItemButton>
              </ListItem>
            </Link>
          </List>
          <Divider sx={{ backgroundColor: "white" }} />
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <button onClick={handleLogout} className='px-5 py-2 border border-yellow-400 text-yellow-400 font-bold w-full'>Logout</button>
              </ListItemButton>
            </ListItem>
          </List>
        </>
      )}
      {!isUser && !admin && (
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <button className='px-5 py-2 border border-yellow-400 text-yellow-400 font-bold w-full'><Link sx={{ width: "full" }} to="/admin/login">Login</Link></button>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <button className='px-5 py-2 border border-yellow-400 text-yellow-400 font-bold w-full'><Link sx={{ width: "full" }}>Register</Link></button>
            </ListItemButton>
          </ListItem>
        </List>
      )}
      {isUser && (
        <>
          <List>
            <Link to="/">
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon sx={{ color: "white" }}>
                    <MailIcon />
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItemButton>
              </ListItem>
            </Link>
            <Link to="/user/update/details">
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon sx={{ color: "white" }}>
                    <MailIcon />
                  </ListItemIcon>
                  <ListItemText primary="Update Details" />
                </ListItemButton>
              </ListItem>
            </Link>
            <Link to="/user/records">
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon sx={{ color: "white" }}>
                    <MailIcon />
                  </ListItemIcon>
                  <ListItemText primary="Booking History" />
                </ListItemButton>
              </ListItem>
            </Link>
          </List>
          <Divider sx={{ backgroundColor: "white" }} />
          <List>
            <Link to="/user/bed/book">
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon sx={{ color: "white" }}>
                    <MailIcon />
                  </ListItemIcon>
                  <ListItemText primary="Book Bed" />
                </ListItemButton>
              </ListItem>
            </Link>
            <Link to="/user/update/details/password">
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon sx={{ color: "white" }}>
                    <MailIcon />
                  </ListItemIcon>
                  <ListItemText primary="Change Password" />
                </ListItemButton>
              </ListItem>
            </Link>
          </List>
          <Divider sx={{ backgroundColor: "white" }} />
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <button onClick={handleLogout} className='px-5 py-2 border border-yellow-400 text-yellow-400 font-bold w-full'>Logout</button>
              </ListItemButton>
            </ListItem>
          </List>
        </>
      )}
    </Box>
  );

  return (
    <div className='bg-green-950 fixed top-0 left-0 z-10 border-b-2 border-b-white rounded-bl-lg rounded-br-lg shadow-md w-full h-fit py-2 px-5 flex justify-between items-center'>
      <div className='w-fit h-fit py-3'>
        <img src={logo} alt="logo.png" className='w-auto h-[2rem]' />
      </div>
      <div>
        <React.Fragment key="right">
          <Button sx={{ color: "white" }} onClick={toggleDrawer(true)}><MenuIcon /></Button>
          <Drawer
            anchor="right"
            open={state}
            onClose={toggleDrawer(false)}
          >
            {list("right")}
          </Drawer>
        </React.Fragment>
      </div>
    </div>
  )
}

export default NavBar