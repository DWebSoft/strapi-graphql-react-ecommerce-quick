import React from "react";
import { Box, Text, Button, Container, Heading, TextField } from "gestalt";
import Toast from "./Toast";
import { getCart, calculatePrice } from "./../utils";

class Checkout extends React.Component {

    state = {
        cartItems: [],
        address: "",
        postalCode: "",
        city: "",
        orderConfimationEmail: "",
        toast: false,
        toastMessage: "",
        loading: false
    }

    componentDidMount() {
        this.setState({cartItems: getCart()});
    }

    handleChange = ({ event, value }) => {
        event.persist();
        this.setState({ [event.target.name]: value });
    }

    handleOrderConfirmation = async (event) => {
        event.preventDefault();
        
        if (this.isFormEmpty(this.state)) {
            this.showToast('Please fill all details');
            return;
        }
        this.setState({ toast: false, toastMessage: '' });

        //Signup User
        try {
            
        } catch (error) {
            //show loading false
            this.setState({ loading: false });
            //show toast message
            this.showToast('Error registering user');
        }
    }

    isFormEmpty = ({ address, postalCode, city, orderConfimationEmail }) => {
        return !address || !city || !postalCode || !orderConfimationEmail;
    }

    showToast = toastMessage => {
        this.setState({ toast: true, toastMessage });
        setTimeout(() => {
            this.setState({ toast: false, toastMessage: '' });
        }, 5000);
    }


    render() {
        const { toast, toastMessage, cartItems } = this.state;
        return (
            <Container>
                <Box
                    color="darkWash"
                    margin={4}
                    padding={3}
                    shape="rounded"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    direction="column"
                >
                    <Heading color="midnight">Checkout</Heading>
                    {/* User Cart */}
                    { cartItems.length !== 0 ? <React.Fragment>
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        direction="column"
                        marginBottom={6}
                        marginTop={2}>
                        <Text italic color="darkGray">{cartItems.length} items for Checkout</Text> 
                        <Box padding={2}>
                            {cartItems.map(item => (
                                <Box key={item._id} padding={1} >
                                    <Text color="midnight">
                                        {item.name} x {item.quantity} - ${(item.quantity * item.price).toFixed(2)}     
                                    </Text>
                                </Box>    
                            ))}
                        </Box>
                        <Text bold>Total Amount: { calculatePrice(cartItems) }</Text>
                    </Box>    
                    {/* Checkout Form */}
                    <form 
                        style={{
                            display: "inlineBlock",
                            textAlign: "center",
                            maxWidth: 450
                        }}
                        onSubmit={this.handleOrderConfirmation}>
                            
                        {/* Address input */}
                        <TextField
                            id="address"
                            name="address"
                            type="text"
                            onChange={this.handleChange}
                            placeholder="Shipping Address"
                        />

                        {/* Postal Code input */}
                        <TextField
                            id="postal-code"
                            name="postalCode"
                            type="number"
                            onChange={this.handleChange}
                            placeholder="Postal Code"
                        />

                        {/* City input */}
                        <TextField
                            id="city"
                            name="city"
                            type="text"
                            onChange={this.handleChange}
                            placeholder="Shipping City"
                        />

                        {/* City input */}
                        <TextField
                            id="orderConfimationEmail"
                            name="orderConfimationEmail"
                            type="email"
                            onChange={this.handleChange}
                            placeholder="Order Confirmation Email"
                        />

                        <Button
                            text="Submit"
                            type="submit" />
                    </form>
                    </React.Fragment> : (
                        <Box
                            color="darkWash" shape="rounded" padding={4}
                        >
                            <Heading color="watermelon" size="xs" align="center">
                                Your cart is empty
                            </Heading>
                            <Text align="center" color="green" italic>Add some brews!</Text>    
                        </Box>
                    )}
                </Box>
                <Toast message={toastMessage} show={toast} />
            </Container>
        );
    }
}

export default Checkout;