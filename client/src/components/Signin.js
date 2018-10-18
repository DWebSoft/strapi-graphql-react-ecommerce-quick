import React from "react";
import { Box, Button, Container, Heading, TextField } from "gestalt";
import Toast from "./Toast";
import { setToken } from "./../utils";

import Strapi from "strapi-sdk-javascript/build/main";

const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

class Signin extends React.Component {

    state = {
        username: "",
        password: "",
        toast: false,
        toastMessage: "",
        loading: false
    };

    handleChange = ({ event, value }) => {
        event.persist();
        this.setState({ [event.target.name]: value });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const { username, password } = this.state;

        if (this.isFormEmpty(this.state)) {
            this.showToast('Please fill all details');
            return;
        }
        this.setState({ toast: false, toastMessage: '' });

        //Signin User
        try {
            //Show loading
            this.setState({ loading: true });
            //Register user using strapi
            const response = await strapi.login(username, password);
            //Hide loading
            this.setState({ loading: false });
            //Put jwt token in localstorage
            setToken(response.jwt);
            //Redirect to home page
            this.redirect('/');
        } catch (error) {
            //show loading false
            this.setState({ loading: false });
            //show toast message
            this.showToast('Error login user');
        }
    }

    isFormEmpty = ({ username, password }) => {
        return !username || !password;
    }

    showToast = toastMessage => {
        this.setState({ toast: true, toastMessage });
        setTimeout(() => {
            this.setState({ toast: false, toastMessage: '' });
        }, 5000);
    }

    redirect = path => this.props.history.push(path);

    render() {
        const { toast, toastMessage, loading } = this.state;
        return (
            <Container>
                <Box
                    dangerouslySetInlineStyle={{
                        __style: {
                            backgroundColor: '#ebe2da'
                        }
                    }}
                    margin={4}
                    padding={3}
                    shape="rounded"
                    display="flex"
                    justifyContent="center"
                >
                    {/* Signin Form */}
                    <form style={{
                        display: "inlineBlock",
                        textAlign: "center",
                        maxWidth: 450
                    }}
                        onSubmit={this.handleSubmit}
                    >
                        <Box
                            marginBottom={2}
                            display="flex"
                            alignItems="center"
                            direction="column"
                        >
                            <Heading color="midnight">Welcome Back!!</Heading>
                        </Box>

                        {/* Username input */}
                        <TextField
                            id="username"
                            name="username"
                            type="text"
                            onChange={this.handleChange}
                            placeholder="Username"
                        />
                        {/* Password input */}
                        <TextField
                            id="password"
                            name="password"
                            type="password"
                            onChange={this.handleChange}
                            placeholder="Password"
                        />
                        <Button
                            inline
                            disabled={loading}
                            color="blue"
                            text="Submit"
                            type="submit" />
                    </form>
                </Box>
                <Toast message={toastMessage} show={toast} />
            </Container>
        );
    }
}

export default Signin;