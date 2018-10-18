import React from "react";
import { Link } from "react-router-dom";
import { Box, Text, Heading, Button, Image, Card, Mask, IconButton } from "gestalt";
import Loader from "./Loader";
import './App.css';
import { calculatePrice, setCart, getCart } from "./../utils";

import Strapi from "strapi-sdk-javascript/build/main";

const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

class Brews extends React.Component {

    state = {
        brews: [],
        brand: "",
        cartItems: [],
        loadingBrews: true
    }

    async componentDidMount() {
       try {
           const response = await strapi.request("POST", "/graphql", {
               data: {
                   query: `query{
                    brand(id: "${this.props.match.params.brandId}") {
                        _id
                        name
                            brews{
                        _id
                        name
                        description
                        price
                        image{
                            url
                        }
                        }    
                    }
                }`
               }
           });
           this.setState({
               brand: response.data.brand.name,
               brews: response.data.brand.brews,
               loadingBrews: false,
               cartItems: getCart()
           });
       } catch (error) {
           console.error(error);
           this.setState({ loadingBrews: false }, () => getCart());
       }
        
    }

    addToCart = brew => {
        const alreadyInCart = this.state.cartItems.findIndex( item => item._id === brew._id );
        if ( alreadyInCart === -1 ) {
            const updatedItems = this.state.cartItems.concat({
                ...brew,
                quantity: 1
            });
            this.setState({ cartItems: updatedItems }, () => setCart(updatedItems));
        } else {
            const updatedItems = [...this.state.cartItems];
            updatedItems[ alreadyInCart ].quantity += 1;
            this.setState({ cartItems: updatedItems }, () => setCart(updatedItems));
        }
    }

    deleteItemFromCart = deletedItemId => {
        const filteredItems = this.state.cartItems.filter(item => item._id !== deletedItemId);
        this.setState({ cartItems: filteredItems }, () => setCart(filteredItems));
    }

    renderBrew = (brew) => {
        return (
            <Box key={brew._id} width={210} margin={2} paddingY={2} >
                <Card image={
                    <Box height={250} width={200} >
                        <Image alt={brew.name} naturalHeight={1} naturalWidth={1}
                            src={`${apiUrl}${brew.image.url}`}
                            fit="cover"
                        >
                        </Image>
                    </Box>
                }>
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        direction="column"
                    >
                        <Box marginBottom={2}>
                            <Text bold size="xl"> {brew.name} </Text>
                        </Box>    
                        <Text> {brew.description} </Text>
                        <Text color="orchid" bold > ${brew.price} </Text>
                        <Box marginTop={2}>
                            <Text bold size="xl">
                                <Button color="blue" text="Add to cart" onClick={() => this.addToCart(brew)} />
                            </Text>
                        </Box>
                    </Box>
                </Card>
            </Box>
        );
    };

    render() {
        const { brand, brews, cartItems, loadingBrews } = this.state;
        return (
           <Box 
           marginTop={4}
           display="flex"
           justifyContent="center"
           alignItems="start"
           dangerouslySetInlineStyle={{
               __style: {
                   flexWrap: "wrap-reverse"
               }
           }}
           >
                {/* Brews Section */}
                <Box display="flex" direction="column" alignItems="center">
                    {/* Brews Heading */}
                    <Box margin={2}>
                        <Heading color="orchid">{brand}</Heading> 
                    </Box>

                    {/* Brews */}
                    <Box 
                        dangerouslySetInlineStyle={{
                            __style: {
                                backgroundColor: "#bdcdd9"
                            }
                        }}
                        wrap
                        shape="rounded"
                        display="flex"
                        justifyContent="center"
                        padding={4}
                    >
                        {brews.map((brew) => this.renderBrew(brew))}
                        <Loader show={loadingBrews} />
                    </Box>
                     
                </Box>

                {/* Cart items */}
                <Box alignSelf="end" marginTop={4} marginLeft={8}>
                    <Mask shape="rounded" wash >
                        <Box display="flex" alignItems="center" justifyContent="center" direction="column"  padding={2}>
                            {/* User Cart Heading */}
                            <Heading align="center" size="sm">Your Cart</Heading>
                            <Text color="gray" italic>
                                {cartItems.length} item selected
                            </Text>

                            {/* cart items */}
                            { cartItems.map((item) => (
                                <Box 
                                    key={item._id}
                                    display="flex"
                                    alignItems="center"
                                >
                                    <Text>
                                        {item.name} X {item.quantity} - ${(item.quantity * item.price).toFixed(2)}
                                    </Text>
                                    <IconButton 
                                        accessibilityLabel="Delete Item"
                                        icon="cancel"
                                        iconColor="red"
                                        size="sm"
                                        onClick = {() => this.deleteItemFromCart(item._id)}
                                    />
                                </Box>
                            )) }

                            <Box display="flex" alignItems="center" justifyContent="center" direction="column">
                                <Box margin={2}>
                                    { cartItems.length === 0 && (
                                        <Text color="red">Please select some items</Text>
                                    )}
                                </Box>
                                <Text size="lg">Total: {calculatePrice(cartItems)}</Text>
                                <Text bold size="xl">
                                    <Link to="/checkout">Checkout</Link>        
                                </Text>    
                            </Box>
                        </Box>
                    </Mask>        
                </Box>    
           </Box>      
        );
    }
}

export default Brews;