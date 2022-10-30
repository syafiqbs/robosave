import React from "react";

// import styles from './dashboard.module.css';

// Components
import Sidenav from "../sidenav/sidenav";
import OTPModal from "../OTPModal/OTPModal";

// Chakra UI imports
import {
  Flex,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Grid,
  GridItem,
} from "@chakra-ui/react";

class Dashboard extends React.Component {
  state = {
    amount: "",
    description: "",
    amountTo: "",
    pin: "",
  };

  render() {
    const handleChange = (event, fieldName) => {
      this.state[fieldName] = event.target.value;

      console.log("value is:", event.target.value);
    };
    return (
      <Flex>
        {/* SIDENAV */}
        <Sidenav />

        {/* MAIN DASHBOARD FLEX */}
        <Flex flexDir="column" ml={10} mt={10}>
          {/* Savings */}
          <Flex
            flexDir="column"
            mb={5}
            bg="gray.100"
            borderRadius="15px"
            px={10}
            py={5}
            ml={"40"}
            mt={"60"}>
            <Text fontSize="3xl" fontWeight="bold" align="center" mb={10}>
              Payment Info
            </Text>
            <Grid gap={6} templateColumns="repeat(2, 1fr)">
              <GridItem>
                <FormControl>
                  <FormLabel>Amount*</FormLabel>
                  <Input
                    bg="white"
                    type="number"
                    onChange={(e) => handleChange(e, "amount")}
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Input
                    bg="white"
                    type="text"
                    onChange={(e) => handleChange(e, "description")}
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>Account to*</FormLabel>
                  <Input
                    bg="white"
                    type="text"
                    onChange={(e) => handleChange(e, "accountTo")}
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>PIN*</FormLabel>
                  <Input
                    bg="white"
                    type="number"
                    onChange={(e) => handleChange(e, "pin")}
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <Button colorScheme="red">Cancel</Button>
              </GridItem>

              <GridItem>
                <OTPModal paymentState={this.state} />
              </GridItem>
            </Grid>
          </Flex>
        </Flex>
      </Flex>
    );
  }
}

export default Dashboard;
