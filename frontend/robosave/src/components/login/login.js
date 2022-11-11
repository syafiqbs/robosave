import React from 'react';

import styles from './login.module.css';

// Chakra UI imports
import { Center, Text, FormControl, FormLabel,Grid, GridItem, Input, Box, Button,  Modal,ModalOverlay,ModalContent,ModalHeader,ModalFooter,ModalBody,ModalCloseButton, } from '@chakra-ui/react'

import blackLogo from "../../assets/black-logo.png";


class Login extends React.Component {
  state = {
    isOpen: false,
    postData: "",
    OTPStatus: false
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
  
  onErrorOpen = () => this.setState({ isErrorOpen: true })
  onErrorClose = () => this.setState({ isErrorOpen: false})

  handleRequestOTP = event => {
    event.preventDefault()
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
            userID: this.state.username,
            pin: this.state.pin,
          })
    };
    // console.log(requestOptions)
    fetch('http://127.0.0.1:5000/OTP', requestOptions)
        .then(response => response.json())
        .then(data => {
          this.setState({ postData: data })
          if (data["0"] === "01000") {
            this.setState({OTPStatus: true})
          } else {
              this.onErrorOpen()
          }
        })
  }

  handleSignIn = event => {
    event.preventDefault();
    const otp = this.state.otp
    console.log(otp)
    // REQUEST OTP CALL
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
            userID: this.state.username,
            PIN: this.state.pin,
            OTP: this.state.otp
          })
    };
    console.log(requestOptions)
    fetch('http://127.0.0.1:5001/checkExisting', requestOptions)
    .then(response => response.json())
    .then(data => {
      this.setState({ postData: data })
      // stringify and set to session
      sessionStorage.setItem("customerInformation", JSON.stringify(data));
      if (data.message === "Existing account" || data.message === "Account has been created.") {
        window.location.href = "/dashboard?cID=" + this.state.username
      } else {
        this.onErrorOpen()
      }
    })
  }

  getSession() {
    console.log("----------------------------------")
    // call and parse it back to access it as a JSON object
    const temp = JSON.parse(sessionStorage.getItem("customerInformation"))
    console.log(temp.customerDetails)
    console.log(temp.customerAccounts.account[0].accountID)
  }

  clearSessionLogout() {
    sessionStorage.clear()
    window.location.href = "/"
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
                <Button colorScheme='green' id="requestOTPButton" mt={5} variant='solid' w="100%" bg='green.400' type="submit" isLoading={this.state.OTPStatus} loadingText='OTP Sending'>
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
              <Button colorScheme='green' mt={5} variant='solid' w="100%" bg='green.400' type="button" onClick={this.getSession}>
                Get session
              </Button>
              <Button colorScheme='green' mt={5} variant='solid' w="100%" bg='green.400' type="button" onClick={this.clearSession}>
                Clear session
              </Button>
          </GridItem>
        </Grid>

      {/* Error Modal */}
        <Modal isOpen={this.state.isErrorOpen} onClose={this.onErrorClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Requesting OTP Failed</ModalHeader>
          <ModalCloseButton />
          <ModalBody> Please input correct username/PIN
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={this.onErrorClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </div>
    )
  }
}


export default Login;
