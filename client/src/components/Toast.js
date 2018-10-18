import React from "react";
import { Box, Toast } from "gestalt";

const ToastMessage = ({ show, message }) => {
    return (
        show && <Box
            position="fixed"
            dangerouslySetInlineStyle={{
                __style: {
                    left: "50%",
                    bottom: 200,
                    transform: "translateX(-50%)"
                }
            }}
        >
            <Toast color="orange"  text={message} />
        </Box>
    );
}
export default ToastMessage;