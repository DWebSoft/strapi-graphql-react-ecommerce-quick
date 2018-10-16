import React from "react";
import { Box, Text, Heading, Image } from "gestalt";
import { NavLink } from "react-router-dom";

const Navbar = () => (
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

export default Navbar;