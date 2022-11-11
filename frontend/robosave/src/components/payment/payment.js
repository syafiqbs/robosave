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
  Select
} from "@chakra-ui/react";


class Dashboard extends React.Component {
  state = {
    amount: "",
    description: "",
    accountTo: "",
    accountFrom: "",
    pin: "",
    cID: "",
    bankAccounts: []
  };

  componentDidMount() {
    let params = new URLSearchParams(document.location.search);
    let cID = params.get("cID");
    if (cID) {this.setState({ cID: cID})}

    const customerInformation = JSON.parse(sessionStorage.getItem("customerInformation"))
    const bankAccounts = customerInformation.customerAccounts.account
    this.setState({customerAccounts: customerInformation.customerAccounts, customerDetails: customerInformation.customerDetails, bankAccounts: bankAccounts})

  }

  render() {
    const handleChange = (event, fieldName) => {
      this.setState((prevState) => ({
        ...prevState,
        [fieldName]: event.target.value,
      }));

      // console.log("value is:", event.target.value);
      // console.log(this.state);
    };

    const checkValidForm = () => {
      const { amount, accountTo, pin } = this.state;
      console.log(this.state, "state");
      return amount > 0 && accountTo.length > 0 && pin.length > 0;
    };

    const pay = () => {

      const requestOptions = {
        method: 'Post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userID: this.state.cID,
          pin: this.state.pin,
          otp: "999999",
          accountFrom: this.state.accountFrom,
          accountTo: this.state.accountTo,
          transactionAmount: this.state.amount,
          narrative: this.state.description
        })
        
      };
      console.log(requestOptions)

      fetch(('http://127.0.0.1:5000/pay'), requestOptions)
      .then(response => response.json())
      .then(data => {
        this.setState({ postData: data })
        // console.log(data)
      });
    }


    return (
      <Flex>
        {/* SIDENAV */}
        <Sidenav dashboardLink={"/dashboard?cID=" + this.state.cID}/>

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
            // mt={"60"}
            >
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
                <FormControl isRequired>
                  <FormLabel>Account to</FormLabel>
                  <Input
                    bg="white"
                    type="text"
                    onChange={(e) => handleChange(e, "accountTo")}
                  />
                </FormControl>
              </GridItem>

              <GridItem colSpan={2}>
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
                  <FormLabel>Account from</FormLabel>
                  {/* <Input
                    bg="white"
                    type="number"
                    onChange={(e) => handleChange(e, "accountFrom")}
                  /> */}
                  <Select 
                  bg='white'
                  placeholder='Select bank account' 
                  onChange={(e) => handleChange(e, "accountFrom")}
                  >
                    {this.state.bankAccounts
                    .map(account => <option key={account.accountID} value={account.accountID}>{account.accountID}</option>)}
                  </Select>
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
              {/* <GridItem>
                <OTPModal
                  paymentState={this.state}
                  checkValidForm={checkValidForm}
                />
              </GridItem> */}

              <GridItem>
                <Button colorScheme="green" onClick={pay}>Confirm</Button>
              </GridItem>
            </Grid>
          </Flex>
        </Flex>
      </Flex>
    );
  }
}

export default Dashboard;
