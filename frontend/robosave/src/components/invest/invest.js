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
  };

  componentDidMount() {
    let params = new URLSearchParams(document.location.search);
    let cID = params.get("cID");
    if (cID) {
      this.setState({ cID: cID });
    }

    const pin = JSON.parse(sessionStorage.getItem("pin"))
    this.setState({ pin: pin})
    console.log(pin)
    console.log(cID)
    // get customer stocks details
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
        console.log(data);
        this.setState({ investData: [data.data] });
      })
      .catch((err) => console.log(err));
  }

  render() {
    console.log("state", this.state.investData);
    if (this.state.investData.length == 0) {
      return;
    }

    const handleBuy = () => {
      let requestOptions = {
        method: "Post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountFrom: "9248",
          customer_id: this.state.cID,
          PIN: "000000",
          OTP: "999999",
        }),
      };

      console.log(sessionStorage)

      fetch("http://127.0.0.1:5000/invest", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          // this.setState({ investData: data.data });
        })
        .catch((err) => console.log(err));
    };

    const handleSell = (row) => {
      // console.log(row);
      let requestOptions = {
        method: "Post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountFrom: "9247",
          customer_id: this.state.cID,
          pin: this.state.pin,
          // otp: "999999",
          symbol: "AAPL",
          stockQty: "1",
        }),
      };
      console.log(requestOptions)
      fetch("http://127.0.0.1:5000/sell", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          // this.setState({ investData: data.data });
        })
        .catch((err) => console.log(err));
    };

    return (
      <Flex>
        {/* SIDENAV */}
        <Sidenav
          dashboardLink={"/dashboard?cID=" + this.state.cID}
          investLink={"#"}
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
                as={Link}
                color="white"
                bg="black"
                _hover={{ boxShadow: "2px 2px 5px #68D391;" }}
                onClick={handleBuy}>
                Buy
              </Button>
            </Flex>

            <Flex bg="gray.100" w="100%" borderRadius="15px">
              <TableContainer my={2}>
                <Table variant="simple" display="block" overflowY="auto">
                  <Thead>
                    <Tr>
                      <Th>Customer ID</Th>
                      <Th>Trading Date</Th>
                      <Th isNumeric>Price</Th>
                      <Th isNumeric>Quantity</Th>
                      <Th>Symbol</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {/* Loop/map here */}
                    {this.state.investData.map((row, index) => (
                      <Tr key={index}>
                        <Td>{row.customerID}</Td>
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
                              onClick={() => handleSell(row)}>
                              Sell
                            </Button>
                          ) : (
                            <Button
                              disabled
                              color="white"
                              bg="black"
                              _hover={{ boxShadow: "2px 2px 5px #68D391;" }}
                              onClick={() => handleSell(row)}>
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
      </Flex>
    );
  }
}

export default Invest;
