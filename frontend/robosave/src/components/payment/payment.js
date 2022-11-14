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
  Select,
  Link,
  Modal,ModalOverlay,ModalContent,ModalHeader,ModalFooter,ModalBody,ModalCloseButton,
} from "@chakra-ui/react";


class Dashboard extends React.Component {
  state = {
    amount: "",
    description: "",
    accountTo: "",
    accountFrom: "",
    pin: "",
    cID: "",
    bankAccounts: [],
    organizations : [],
    transactionMessage: ""
  };

  onErrorOpen = () => this.setState({ isErrorOpen: true })
  onErrorClose = () => {
    this.setState({ isErrorOpen: false})
    window.location.reload()
  }

  componentDidMount() {
    let params = new URLSearchParams(document.location.search);
    let cID = params.get("cID");
    if (cID) {this.setState({ cID: cID})}

    const customerInformation = JSON.parse(sessionStorage.getItem("customerInformation"))
    const bankAccounts = customerInformation.customerAccounts.account
    this.setState({customerAccounts: customerInformation.customerAccounts, customerDetails: customerInformation.customerDetails, bankAccounts: bankAccounts})

    fetch(('http://127.0.0.1:5000/billingorg'))
      .then(response => response.json())
      .then(data => {
        let billingOrgs = []
        for (const organization in data) {
          billingOrgs.push({organization: organization, accountID: data[organization]})
        }
        
        this.setState({organizations: billingOrgs})
      });

  }

  render() {
    const handleChange = (event, fieldName) => {
      this.setState((prevState) => ({
        ...prevState,
        [fieldName]: event.target.value,
      }));
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
          accountFrom: String(Number(this.state.accountFrom)),
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
        console.log(data)
        if (data.code === 201) {
          this.setState({ transactionMessage: "Transaction Successful"})
        } else {
          this.setState({ transactionMessage: "Transaction Failed"})
        }
        this.onErrorOpen()
        // CREATE MODAL FOR SUCCESS/ERROR CREATE MODAL FOR SUCCESS/ERROR CREATE MODAL FOR SUCCESS/ERROR CREATE MODAL FOR SUCCESS/ERROR CREATE MODAL FOR SUCCESS/ERROR
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
            ml={"20"}
            mt={"90"}
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
                  <FormLabel>Billing Organization</FormLabel>
                  <Select 
                    bg='white'
                    placeholder='Select bank account' 
                    onChange={(e) => handleChange(e, "accountTo")}
                  >
                    {this.state.organizations
                    .map(org => <option key={org.accountID} value={org.accountID}>{org.organization}</option>)}
                  </Select>
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
                <Link
                  href={"/dashboard?cID=" + this.state.cID}
                  _hover={{color: 'black', backgroundColor: "#68D391"}}
                >
                  <Button 
                  color = "#E53E3E"
                  bg= "gray.100"
                  _hover={{color: 'black', backgroundColor: "#C53030"}}
                  >Cancel</Button>
                </Link>
              </GridItem>

              {/* Submit / OTP Modal */}
              {/* <GridItem>
                <OTPModal
                  paymentState={this.state}
                  checkValidForm={checkValidForm}
                />
              </GridItem> */}

              <GridItem>
                <Button
                  color = "green.500"
                  bg= "gray.100"
                  _hover={{color: 'black', backgroundColor: "green.300"}} 
                  onClick={pay}
                  >Confirm</Button>
              </GridItem>
            </Grid>
          </Flex>
        </Flex>


        {/* Error Modal */}
        <Modal isOpen={this.state.isErrorOpen} onClose={this.onErrorClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Transaction</ModalHeader>
          <ModalCloseButton />
          <ModalBody> {this.state.transactionMessage}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={this.onErrorClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </Flex>
    );
  }
}

export default Dashboard;
