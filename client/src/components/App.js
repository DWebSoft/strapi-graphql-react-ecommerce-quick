import React, { Component } from 'react';
import { Container, Box, Heading, Card, Text, Image, SearchField, Icon } from "gestalt";
import Loader from "./Loader";
import './App.css';
import Strapi from "strapi-sdk-javascript/build/main";
import { Link } from "react-router-dom";

const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi( apiUrl );

class App extends Component {

  state = {
    brands: [],
    searchTerm: "",
    loadingBrands: true
  }

  async componentDidMount() {
    try {
      const response = await strapi.request("POST", '/graphql', {
        data: {
          query: `
        query{
          brands{
            _id
            name
            description
            image {
              url
            }
          }
        }`
        }
      });
      this.setState({ "brands": response.data.brands, loadingBrands: false});
    } catch (error) {
      console.error(error);
      this.setState({ loadingBrands: false });
    }
  }

  handleChange = ({value}) => {
    this.setState({searchTerm: value});
  }

  filterBrands = () => {
    const { brands, searchTerm } = this.state;
    return brands.filter(function(brand){
        return brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          brand.description.toLowerCase().includes(searchTerm.toLowerCase());
    })
  }

  renderBrand = (brand) => {
    return (
      <Box key={brand._id} width={200} margin={2} paddingY={2} >
        <Card image={
          <Box height={200} width={200} >
            <Image alt={brand.name} naturalHeight={1} naturalWidth={1}
              src={`${apiUrl}${brand.image.url}`}
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
            <Text bold size="xl"> {brand.name} </Text>
            <Text> {brand.description} </Text>
            <Text bold size="xl">
              <Link to={`${brand._id}`}>See Brews</Link>
            </Text>
          </Box>
        </Card>
      </Box>
    );
  };

  render() {
    const { searchTerm, loadingBrands } = this.state;
    return (
      <Container>
        {/* Brands Section */}
        <Box 
          marginBottom={2}
          display="flex"
          justifyContent="center">
          <Heading color="midnight">
            Brew Brands
          </Heading>
        </Box>

        {/* Brands Filter */}
        <Box display="flex" justifyContent="center" marginTop={4} >
          <SearchField
            id="searchField"
            accessibilityLabel="Search Brands"
            onChange={this.handleChange}
            placeholder="Search Brands"
            value={searchTerm}
          />
          <Box margin={2}>
            <Icon
              icon="filter"
              color={ searchTerm ? "orange" : "gray"}
              size={20}
              accessibilityLabel="Filter Icon"
            />
          </Box>
        </Box> 

         {/* Brands  */}
        <Box 
          dangerouslySetInlineStyle ={{
            __style: {
              backgroundColor: "#d6c8ec"
            }
          }}
          shape="rounded"
          wrap display="flex" justifyContent="around" margin={5}>
          {this.filterBrands().map((brand) => this.renderBrand(brand))}
        </Box>
        <Loader show={loadingBrands}/>  
      </Container>  
    );
  }
}

export default App;

