import React from "react";
import { Box, Text, Button, Container, Heading, TextField, Modal, Spinner } from "gestalt";
import Toast from "./Toast";
import { getCart, calculatePrice, clearCart, calculateAmount } from "./../utils";
import { StripeProvider, Elements, injectStripe, CardElement } from "react-stripe-elements";
import { withRouter } from "react-router-dom";

import Strapi from "strapi-sdk-javascript/build/main";

const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

class _Checkout extends React.Component {

    state = {
        cartItems: [],
        address: "",
        postalCode: "",
        city: "",
        orderConfimationEmail: "",
        toast: false,
        toastMessage: "",
        loading: false,
        orderProcessing: false,
        modal: false
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
        this.setState({modal: true});
    }

    handleSubmitOrder = async () => {
        const { cartItems, city, address, postalCode } = this.state;
        const amount = calculateAmount( cartItems );

        //Process order
        this.setState({ orderProcessing: true });
        let token;

        try {
            //create a stripe token
            const response = await this.props.stripe.createToken();
            token = response.token.id;

            //Submit order
            await strapi.createEntry('orders', {
                amount,
                brews: cartItems,
                postalCode,
                city,
                address,
                token
            });

            this.setState({ orderProcessing: false, modal: false });
            clearCart();
            this.showToast("Your order has been successfully submitted", true);

        } catch (error) {
            this.setState({ orderProcessing: false, modal: false });
            this.showToast(error.message);
        }
    }

    isFormEmpty = ({ address, postalCode, city, orderConfimationEmail }) => {
        return !address || !city || !postalCode || !orderConfimationEmail;
    }

    showToast = ( toastMessage, redirect = false ) => {
        this.setState({ toast: true, toastMessage });
        setTimeout(() => {
            this.setState({ toast: false, toastMessage: '' },
                () => redirect && this.props.history.push('/')
            );
        }, 5000);
    }

    closeModal = () => this.setState({ modal: false });

    render() {
        const { toast, toastMessage, cartItems, modal, orderProcessing } = this.state;
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
                            marginBottom={1}
                        />

                        {/* Postal Code input */}
                        <TextField
                            id="postal-code"
                            name="postalCode"
                            type="text"
                            onChange={this.handleChange}
                            placeholder="Postal Code"
                            marginBottom={1}
                        />

                        {/* City input */}
                        <TextField
                            id="city"
                            name="city"
                            type="text"
                            onChange={this.handleChange}
                            placeholder="Shipping City"
                            marginBottom={1}
                        />

                        {/* City input */}
                        <TextField
                            id="orderConfimationEmail"
                            name="orderConfimationEmail"
                            type="email"
                            onChange={this.handleChange}
                            placeholder="Order Confirmation Email"
                        />

                        {/* Credit Card Input */}
                        <CardElement id="stripe__input" onReady={input => input.focus() }  />

                        <button
                            id="stripe__button"
                            type="submit">
                            Submit
                        </button>    
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

                {/* Confirmation Modal Area */}
                { modal && (
                    <ConfirmationModal 
                    orderProcessing={orderProcessing}
                    closeModal={this.closeModal}
                    cartItems={cartItems}
                    handleSubmitOrder={this.handleSubmitOrder}  />
                )}

                <Toast message={toastMessage} show={toast} />
            </Container>
        );
    }
}

const ConfirmationModal = ({orderProcessing, cartItems, closeModal, handleSubmitOrder}) => (
    <Modal 
        accessibilityCloseLabel="Close"
        accessibilityModalLabel="Confirm Your Order"
        heading="Confirm Your Order"
        onDismiss={closeModal}
        footer={
            <Box display="flex" marginRight={-1} marginLeft={-1} justifyContent="center">
                <Box padding={1}>
                    <Button 
                        size="lg" 
                        color="red" 
                        text="Submit" 
                        disabled={orderProcessing}
                        onClick={handleSubmitOrder} />    
                </Box>
                <Box padding={1}>
                    <Button
                        size="lg"
                        text="Cancel"
                        disabled={orderProcessing}
                        onClick={closeModal} />
                </Box>
            </Box>
        }
        role="alertdialog"
        size="sm"
    >
        <Box paddingY={2}> 
            {/* Order Summary */}
            { !orderProcessing && (
                <Box color="lightWash" display="flex" justifyContent="center" alignItems="center" direction="column" padding={2}>
                    {cartItems.map(item => (
                        <Box key={item._id} padding={1} >
                            <Text color="red" size="lg" >
                                {item.name} x {item.quantity} - ${(item.quantity * item.price).toFixed(2)}
                            </Text>
                        </Box>
                    ))}
                    <Box paddingY={2}>
                        <Text size="lg" bold>Total Amount: {calculatePrice(cartItems)}</Text>
                    </Box>
                </Box>
            )}
            {/* Order Processing Spineer */}
            <Spinner show={orderProcessing} accessibilityLabel="Order Processing Spinner" />
            {orderProcessing && <Text align="center" italic>Submitting Order...</Text>}
        </Box>
    </Modal>
);

const CheckoutForm = withRouter( injectStripe(_Checkout) );

const Checkout = () => (
    <StripeProvider apiKey="pk_test_wGWJGQ4UK9KmdzLMJPgGbo5O">
        <Elements>
             <CheckoutForm/>   
        </Elements>    
    </StripeProvider>
)

export default Checkout;