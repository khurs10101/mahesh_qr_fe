import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Button } from '@mui/material';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import User from './userManagements/userPage';
import UserDetailsPage from './userManagements/userDetailsPage';
import AdminList from './adminManagement/adminList';
import InventoryList from './inventoryManagement/InventoryList';
import InventoryUpdate from './inventoryManagement/inventoryUpdatePage'
import InventorySingle from './inventoryManagement/inventorySingle';
import DashboardPage from './dashboardPage';
import CouponPrint from './couponManagement/couponPrint';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    }),
);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const Dashboard = () => {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [jsx, setJsx] = React.useState();


    React.useEffect(() => {
        setJsx(<DashboardPage handleParentClick={handleChildClick} />)
    }, [])

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleChildClick = (e, payload) => {

        if (payload.name === "fromUserPage") {
            setJsx(<UserDetailsPage handleParentClick={handleChildClick} user={payload.data} />)
        }

        if (payload.name === "fromAdmin") {

        }

        if (payload.name === "updateInventory") {
            setJsx(<InventoryUpdate handleParentClick={handleChildClick} />)
        }

        if (payload.name === "fromInventory") {
            setJsx(<InventorySingle handleParentClick={handleChildClick} inventory={payload.data} />)
        }

        if (payload.name === "toInventoryList") {
            setJsx(<InventoryList company={payload.data} handleParentClick={handleChildClick} />)
        }

        if (payload.name === "toCouponPrint") {
            setJsx(<CouponPrint handleParentClick={handleChildClick} batchData={payload.data} />)
        }

        if (payload.name === "back") {
            setJsx(<DashboardPage handleParentClick={handleChildClick} />)
        }

        if (payload.name === "backFromUserSingle") {
            setJsx(<User handleParentClick={handleChildClick} />)
        }

    }

    const handleClick = (e, name) => {

        console.log(name)
        if (name == "users") {
            setJsx(<User handleParentClick={handleChildClick} />)
            handleDrawerClose()
        }

        if (name == "admins") {
            setJsx(<AdminList handleParentClick={handleChildClick} />)
            handleDrawerClose()
        }

        if (name == "inventory") {
            setJsx(<DashboardPage handleParentClick={handleChildClick} />)
            handleDrawerClose()
        }

        if (name === "updateInventory") {
            setJsx(<InventoryUpdate handleParentClick={handleChildClick} />)
            handleDrawerClose()
        }

        if (name == "logout") {
            localStorage.clear()
            window.location.reload(false)
        }
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <div style={{
                        // border: '1px solid white',
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'space-between'
                    }}>
                        <Typography variant="h6" noWrap component="div">
                            Coupon Management System
                        </Typography>
                        <Button onClick={(e) => handleClick(e, "logout")} color="inherit">Logout</Button>
                    </div>
                </Toolbar>
            </AppBar>

            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>


                    <ListItem button
                        onClick={(e, name = "inventory") => handleClick(e, name)}
                    >
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Inventory"} />
                    </ListItem>
                </List>
                <List>


                    <ListItem button
                        onClick={(e, name = "updateInventory") => handleClick(e, name)}
                    >
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Update Inventory"} />
                    </ListItem>
                </List>
                <Divider />
                <List>


                    <ListItem button
                        onClick={(e, name = "users") => handleClick(e, name)}
                    >
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Users"} />
                    </ListItem>
                    <ListItem button
                        onClick={(e, name = "admins") => handleClick(e, name)}
                    >
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Admins"} />
                    </ListItem>
                </List>
            </Drawer>
            <Main open={open}>
                <DrawerHeader />
                {jsx}
            </Main>
        </Box>
    );
}

export default Dashboard