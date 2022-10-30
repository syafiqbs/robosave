import React from 'react';

import styles from './login.module.css';

// Chakra UI imports
import { Center, Text, FormControl, FormLabel,Grid, GridItem, Input, Box, Button, } from '@chakra-ui/react'

import blackLogo from "../../assets/black-logo.png";


class Login extends React.Component {
  state = {
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
    // console.log(e.target.name, e.target.value)
  }

  handleChangeOTP = e => {
    this.setState({
      [e.target.name]: ""
    })
    this.setState({
      [e.target.name]: e.target.value
    })
    console.log(e.target.name, e.target.value)
  }
  
  handleRequestOTP = event => {
    event.preventDefault();
    const username = this.state.username
    const pin = this.state.pin
    // console.log(username, pin)
    // REQUEST OTP CALL
    const ApiURL = "http://tbankonline.com/SMUtBank_API/Gateway"
    const headerObj = {
      Header: {
        serviceName: "requestOTP",
        userID: username,
        PIN: pin
      }
    }

    var header = JSON.stringify(headerObj);
    var xmlHttp = new XMLHttpRequest();
    if (xmlHttp === null) {
      alert("Browser does not support HTTP request.");
      return;
    }
    console.log(ApiURL+"?Header="+header)
    xmlHttp.open("GET", ApiURL+"?Header="+header, true);
    xmlHttp.timeout = 5000

    // setup http event handlers
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
          let responseObj = JSON.parse(xmlHttp.responseText);
          let serviceRespHeader = responseObj.Content.ServiceResponse.ServiceRespHeader;
          let globalErrorID = serviceRespHeader.GlobalErrorID;
          if (globalErrorID === "010041"){
              return;
          }
          else if (globalErrorID !== "010000"){
              alert(serviceRespHeader.ErrorDetails);
              return;
          }
          
          // display data
          document.getElementById("requestOTPButton").innerHTML = "OTP Sent";
      }
  };			

  // send the http request
  xmlHttp.send();
  }

  handleSignIn = event => {
    event.preventDefault();
    const otp = this.state.otp
    console.log(otp)
    // REQUEST OTP CALL
    
  }


  render() {
    return (
      <div className={styles.body}>
        <Grid
          h='100vh'
          templateColumns='repeat(11, 1fr)'
          gap={4}
        >

          {/* LEFT COLOUMN - LOGO COLUMN */}
          <GridItem colSpan={6} className={styles.main}>
            <Center>
              <Box m={40}>
                <img src={blackLogo} alt="" width="250"></img>                            
                <Center>
                  <Text fontSize='5xl' fontWeight="bold" mt={2}>robosave</Text>
                </Center>
              </Box>
            </Center>
          </GridItem>

          {/* RIGHT COLUMN - LOG IN COLUMN */}
          <GridItem colSpan={5}>
            <Box mx={20} mt={20}>
              <Text fontSize='3xl' fontWeight="semibold">Sign In</Text>
              <Text fontSize='l' mt={1} color="gray.400">Enter your Username and PIN to sign in!</Text>
            </Box>
            <form onSubmit={this.handleRequestOTP}>
              <FormControl isRequired mx={20} my={5} width="auto" >
                <FormLabel >Username</FormLabel>
                <Input mb={5} placeholder='Username' id="username" name="username" onChange={(e) => {
                this.handleChange(e)
              }}/>
                <FormLabel>PIN</FormLabel>
                <Input mb={5} type='password' id="pin" placeholder='6 Digit PIN' name="pin" onChange={(e) => {
                this.handleChange(e)
              }}/>
                <Button colorScheme='green' id="requestOTPButton" mt={5} variant='solid' w="100%" bg='green.400' type="submit">
                  Request OTP
                </Button>
              </FormControl>
            </form>
            <form onSubmit={this.handleSignIn}>
              <FormControl isRequired mx={20} my={5} width="auto" >
                <FormLabel >One-Time Password</FormLabel>
                <Input mb={5} type='password' id="otp" placeholder='6 Digit OTP' name="otp" onChange={(e) => {
                this.handleChange(e)
              }}/>
                <Button colorScheme='green' mt={5} variant='solid' w="100%" bg='green.400' type="submit">
                  Sign In
                </Button>
              </FormControl>
            </form>
            <a href="/dashboard">
              <Button colorScheme='green' mt={5} variant='solid' w="100%" bg='green.400' type="button">
                Go to dashboard (temp button)
              </Button>
            </a>
          </GridItem>
        </Grid>

      </div>
    )
  }
}


export default Login;
