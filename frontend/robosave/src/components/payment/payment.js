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
    accountTo: "",
    pin: "",
  };

  render() {
    const handleChange = (event, fieldName) => {
      this.setState((prevState) => ({
        ...prevState,
        [fieldName]: event.target.value,
      }));

      console.log("value is:", event.target.value);
      console.log(this.state);
    };

    const checkValidForm = () => {
      const { amount, accountTo, pin } = this.state;
      console.log(this.state, "state");
      return amount > 0 && accountTo.length > 0 && pin.length > 0;
    };


    return (
      <Flex>
        {/* SIDENAV */}
        <Sidenav />

        {/* MAIN DASHBOARD FLEX */}
        <Flex flexDir="column" ml={10} mt={10}>
          {/* Payment Info */}
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

            {/* Form Grid */}
            <Grid gap={6} templateColumns="repeat(2, 1fr)">
              <GridItem>
                <FormControl isRequired>
                  <FormLabel>Amount</FormLabel>
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
                <FormControl isRequired>
                  <FormLabel>Account to</FormLabel>
                  <Input
                    bg="white"
                    type="text"
                    onChange={(e) => handleChange(e, "accountTo")}
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl isRequired>
                  <FormLabel>PIN</FormLabel>
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

              {/* Submit / OTP Modal */}
              <GridItem>
                <OTPModal
                  paymentState={this.state}
                  checkValidForm={checkValidForm}
                />
              </GridItem>
            </Grid>
          </Flex>
        </Flex>
      </Flex>
    );
  }
}

export default Dashboard;
