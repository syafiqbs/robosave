import React from "react";

// import styles from './dashboard.module.css';

// Components
import Sidenav from "../sidenav/sidenav";

// import {  } from '@chakra-ui/icons'

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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  FormHelperText,
} from "@chakra-ui/react";

import { Link } from "react-router-dom";

class Invest extends React.Component {
  state = {
    amount: "",
    description: "",
    accountTo: "",
    accountFrom: "",
    pin: "",
    cID: "",
    bankAccounts: [],
    organizations: [],
    transactionMessage: "",
    investData: [],
    isSellModalOpen: false,
    isBuyModalOpen: false,
    workingRow: "",
    quantity: "",
    moneyBack: "",
    investMessage: "",
    notToday: true
  };

  componentDidMount() {
    let params = new URLSearchParams(document.location.search);
    let cID = params.get("cID");
    if (cID) {
      this.setState({ cID: cID });
    }

    const pin = sessionStorage.getItem("pin");
    this.setState({ pin: pin });

    const today = new Date().getDate()
    console.log("Today's dd: " + today)

    let dateToInvest = 14
    if (Number(today) == dateToInvest) {
      this.setState({notToday: false})
    } else {
      this.setState({notTodayMessage: "Please come back to invest on the " + dateToInvest + "th of the month"})
    }

    const customerInformation = JSON.parse(
      sessionStorage.getItem("customerInformation")
    );
    const bankAccounts = customerInformation.customerAccounts.account;
    this.setState({
      customerAccounts: customerInformation.customerAccounts,
      customerDetails: customerInformation.customerDetails,
      bankAccounts: bankAccounts,
    });

    let requestOptions = {
      method: "Post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID: cID,
        PIN: pin,
        OTP: "999999",
      }),
    };

    fetch("http://127.0.0.1:5000/stocks", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data, "data");
        let temp;
        if (data.data && Array.isArray(data.data)) {
          temp = data.data;
        } else {
          temp = [data.data];
        }
        this.setState({ investData: temp });
      })
      .catch((err) => console.log(err));
  }


  onBuyModalOpen = () => this.setState({ isBuyModalOpen: true });
  onBuyModalClose = () => {
    this.setState({ isBuyModalOpen: false });
    // window.location.reload();
  };

  onSellModalOpen = () => {this.setState({ isSellModalOpen: true })};
  onSellModalClose = () => {
    this.setState({ isSellModalOpen: false });
    // window.location.reload();
  };

  onInvestModalOpen = () => {
    this.setState({ isInvestModalOpen: true})
  }
  onInvestModalClose = () => {
    this.setState({ isInvestModalOpen: false})
    window.location.reload();
  }

  render() {

    const handleChange = (event, fieldName) => {
      event.preventDefault()
      this.setState((prevState) => ({
        ...prevState,
        [fieldName]: event.target.value,
      }));
    };

    const handleBuy = () => {
      let requestOptions = {
        method: "Post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountFrom: this.state.accountFrom,
          customer_id: this.state.cID,
          pin: this.state.pin,
          otp: "999999",
        }),
      };


      fetch("http://127.0.0.1:5000/invest", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          this.setState({ investMessage: "Transaction " + data.status });
        })
        .catch((err) => console.log(err));
        this.onInvestModalOpen()
    };

    const handleSell = (row) => {
      console.log(row);
      let requestOptions = {
        method: "Post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountFrom: this.state.accountFrom,
          customer_id: this.state.cID,
          pin: this.state.pin,
          symbol: row.symbol,
          stockQty: this.state.quantity,
        }),
      };
      console.log(requestOptions);
      fetch("http://127.0.0.1:5000/sell", requestOptions)
        .then((response) => response.json())
        .then((data) => { 
          console.log(data.status);
          if (data.status == "success") {
            let moneyBack = "$" + (this.state.quantity * row.price).toFixed(2)
            this.setState({moneyBack: moneyBack + " is deposited back to your bank account." })
          }
          this.setState({ investMessage: "Transaction " + data.status });
        })
        .catch((err) => console.log(err));
      this.onInvestModalOpen()
    };

    return (
      <Flex>
        {/* SIDENAV */}
        <Sidenav
          dashboardLink={"/dashboard?cID=" + this.state.cID}
          investLink={"#"}
          financialLink={"/financialNews?cID=" + this.state.cID}
        />

        {/* MAIN DASHBOARD FLEX */}
        <Flex flexDir="column" ml={10} mt={10}>
          {/* Transactions */}
          <Flex flexDir="column" mb={5}>
            <Flex>
              <Text fontSize="3xl" fontWeight="bold" mb={2}>
                Investments
              </Text>
            </Flex>

            <Flex h="15vh" pt={10}>
              <Button
                isDisabled = {this.state.notToday}
                as={Link}
                color="white"
                bg="black"
                _hover={{ boxShadow: "2px 2px 5px #68D391;" }}
                onClick={(e) => { 
                  e.preventDefault()
                  this.onBuyModalOpen();
                }
                }>
                Invest Round Ups
              </Button>
            </Flex>

            <Flex bg="gray.100" w="100%" borderRadius="15px">
              <TableContainer my={2}>
                <Table variant="simple" display="block" overflowY="auto">
                  <Thead>
                    <Tr>
                      <Th>Trading Date</Th>
                      <Th isNumeric>Price</Th>
                      <Th isNumeric>Quantity</Th>
                      <Th>Symbol</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {/* Loop/map here */}
                    {this.state.investData.length > 0 &&
                      this.state.investData.map((row, index) => (
                        <Tr key={index}>
                          <Td>{row.tradingDate}</Td>
                          <Td>{row.price}</Td>
                          <Td>{row.quantity}</Td>
                          <Td>{row.symbol}</Td>
                          <Td>
                            {row.quantity >= 1 ? (
                              <Button
                                color="white"
                                bg="black"
                                _hover={{ boxShadow: "2px 2px 5px #68D391;" }}
                                onClick={() => {
                                  this.setState({ workingRow: row });
                                  this.onSellModalOpen();
                                }}>
                                Sell
                              </Button>
                            ) : (
                              <Button
                                disabled
                                color="white"
                                bg="black"
                                _hover={{ boxShadow: "2px 2px 5px #68D391;" }}>
                                Sell
                              </Button>
                            )}
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Flex>
          </Flex>
        </Flex>

        {/* Buy Modal */}
        <Modal
          isOpen={this.state.isBuyModalOpen}
          onClose={this.onBuyModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Invest Round Ups</ModalHeader>
            {/* <ModalHeader>{this.state.actionHeader}</ModalHeader> */}
            <ModalCloseButton />
            <ModalBody>
              <FormControl isRequired>
                <FormLabel>Account from</FormLabel>
                <Select
                  disabled={this.state.notToday}
                  bg="white"
                  placeholder="Select bank account"
                  onChange={(e) => handleChange(e, "accountFrom")}>
                  {this.state.bankAccounts.map((account) => (
                    <option key={account.accountID} value={account.accountID}>
                      {account.accountID}
                    </option>
                  ))}
                </Select>
                <Text>{this.state.notTodayMessage}</Text>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                disabled={
                  this.state.accountFrom == ""
                }
                color="white"
                bg="black"
                _hover={{ boxShadow: "2px 2px 5px #68D391;" }}
                onClick={(e) => {
                  e.preventDefault();
                  handleBuy(this.state.workingRow);
                  this.onBuyModalClose();
                }}>
                Buy
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Sell Modal */}
        <Modal
          isOpen={this.state.isSellModalOpen}
          onClose={this.onSellModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Sell</ModalHeader>
            {/* <ModalHeader>{this.state.actionHeader}</ModalHeader> */}
            <ModalCloseButton />
            <ModalBody>
              <FormControl isRequired>
                <FormLabel>Account from</FormLabel>
                <Select
                  bg="white"
                  placeholder="Select bank account"
                  onChange={(e) => handleChange(e, "accountFrom")}>
                  {this.state.bankAccounts.map((account) => (
                    <option key={account.accountID} value={account.accountID}>
                      {account.accountID}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Quantity </FormLabel>
                <FormHelperText>
                  Max quantity: {this.state.workingRow.quantity}
                </FormHelperText>
                <Input
                  bg="white"
                  type="number"
                  onChange={(e) => handleChange(e, "quantity")}
                  min={1}
                  max={this.state.workingRow.quantity}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                disabled={
                  Number(this.state.quantity) < 1 ||
                  Number(this.state.quantity) > Number(this.state.workingRow.quantity)
                }
                color="white"
                bg="black"
                _hover={{ boxShadow: "2px 2px 5px #68D391;" }}
                onClick={(e) => {
                  e.preventDefault();
                  handleSell(this.state.workingRow);
                  this.onSellModalClose();
                }}>
                Sell
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>


          {/* Sell Modal */}
          <Modal
          isOpen={this.state.isInvestModalOpen}
          onClose={this.onInvestModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Investment</ModalHeader>
            <ModalCloseButton />
            <ModalBody>{this.state.investMessage}<br></br>{this.state.moneyBack}
            </ModalBody>
            <ModalFooter>
              <Button
                color="white"
                bg="black"
                _hover={{ boxShadow: "2px 2px 5px #68D391;" }}
                onClick={this.onInvestModalClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    );
  }
}

export default Invest;
