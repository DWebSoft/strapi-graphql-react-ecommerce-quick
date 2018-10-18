import React from "react";
import { GridLoader } from "react-spinners";
import { Box } from "gestalt";

const Loader = ({show})=> {
    console.log(show) 
    return (
        show && <Box
        position="fixed"
        dangerouslySetInlineStyle={{
            __style:{
                left: "50%",
                top: 300,
                transform: "translateX(-50%)"
            }
        }}
        >
        <GridLoader color="darkorange" size={30} margin="5px" />
    </Box>     
    );
}
export default Loader;