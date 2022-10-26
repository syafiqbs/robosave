import React from 'react';

import styles from './login.module.css';
import { Center, Text, FormControl, FormLabel, FormErrorMessage, FormHelperText, Input, Box, Button } from '@chakra-ui/react'
import { Grid, GridItem } from '@chakra-ui/react'

import blackLogo from "../../assets/black-logo.png";

class Login extends React.Component {
  render() {
    return (
      <div className={styles.body}>
        <Grid
          h='800px'
          templateColumns='repeat(11, 1fr)'
          gap={4}
        >
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
          <GridItem colSpan={5}>
            <Box mx={20} mt={40}>
              <Text fontSize='3xl' fontWeight="semibold">Sign In</Text>
              <Text fontSize='l' mt={1} color="gray.400">Enter your Username and Pin to sign in!</Text>
            </Box>
            <FormControl isRequired mx={20} my={5} width="auto">
              <FormLabel >Username</FormLabel>
              <Input mb={5} placeholder='Username'/>
              <FormLabel>PIN</FormLabel>
              <Input mb={5} placeholder='6 Digit PIN'/>
              <Button colorScheme='green' mt={5} variant='solid' w="100%" bg='green.400'>
                Sign In
              </Button>
            </FormControl>
          </GridItem>
        </Grid>
      </div>
    )
  }
}


export default Login;
