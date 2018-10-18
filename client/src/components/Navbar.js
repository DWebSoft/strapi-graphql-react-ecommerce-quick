import React from "react";
import { Box, Text, Heading, Image, Button } from "gestalt";
import { NavLink, withRouter } from "react-router-dom";
import { getToken, clearCart, clearToken } from "./../utils";

class Navbar extends React.Component {
    handleSignOut = () => {
        clearToken();
        clearCart();
        this.props.history.push('/');
    }
    render() {
        return getToken() !== null ? <AuthNav handleSignOut={this.handleSignOut} /> : <UnAuthNav/>;
    }
}

const AuthNav = ({ handleSignOut }) => (
    <Box
        height={70}
        padding={1}
        color="midnight"
        display="flex"
        alignItems="center"
        justifyContent="around"
    >
        {/* Sigin Link */}
        <NavLink to="/checkout">
            <Text size="xl" color="white">Checkout</Text>
        </NavLink>

        {/* Title and logo */}
        <NavLink exact to="/">
            <Box display="flex" alignItems="center" >
                <Box
                    height={50}
                    width={50}
                    margin={2}
                >
                    <Image
                        src="./icons/logo.svg"
                        alt="BrewHaha logo"
                        naturalHeight={1}
                        naturalWidth={1}
                    />
                </Box>
                <Heading size="xs" color="orange">
                    BrewHaha
                </Heading>
            </Box>
        </NavLink>

        {/* Signout Button */}
        <Button inline color="transparent" size="sm" text="Sign Out" onClick={handleSignOut} />
    </Box>
)


const UnAuthNav = () => (
    <Box 
        height={70}
        padding={1}
        color="midnight"
        display="flex"
        alignItems="center"
        justifyContent="around"
    >
        {/* Sigin Link */}
        <NavLink to="/signin">
            <Text size="xl" color="white">Sign In</Text>
        </NavLink> 

        {/* Title and logo */}
        <NavLink exact to="/">
            <Box display="flex" alignItems="center" >
                <Box
                    height={50}
                    width={50}
                    margin={2}
                >
                    <Image
                        src="./icons/logo.svg"
                        alt= "BrewHaha logo"
                        naturalHeight = {1}
                        naturalWidth = {1}
                    />
                </Box>
                <Heading size="xs" color="orange">
                    BrewHaha
                </Heading>
            </Box>    
        </NavLink>    
    
        {/* Sigup Link */}
        <NavLink to="/signup">
            <Text size="xl" color="white">Sign Up</Text>
        </NavLink>    
    </Box>
)

export default withRouter(Navbar);