import React from 'react';

// import styles from './dashboard.module.css';

// Components
import Sidenav from '../sidenav/sidenav';

// Chakra UI imports
import { Flex, Text, Button, Table, Thead,Tbody,Tfoot,Tr,Th,Td,TableCaption,TableContainer,   Stat,StatLabel,StatNumber,StatHelpText,StatArrow,StatGroup, } from '@chakra-ui/react'
// import {  } from '@chakra-ui/icons'
import { Link } from 'react-router-dom';



class Dashboard extends React.Component {
  state = {
    cID: "",
    customerTransactions: [],
    monthRoundUp: "0.00",
    customerTransactions: [{transaction_id: "No transaction", transaction_date: "", value_before: 0, value_roundup: 0, value_after: 0}]
  }

  componentDidMount() {
    let params = new URLSearchParams(document.location.search);
    let cID = params.get("cID");
    if (cID) {this.setState({ cID: cID })} // to do a no account redirect
    
    const customerInformation = JSON.parse(sessionStorage.getItem("customerInformation"))
    this.setState({customerAccounts: customerInformation.customerAccounts, customerDetails: customerInformation.customerDetails})

    let month = new Date().getMonth() + 1
    this.setState({month: month})

    let firstAPICall = fetch('http://127.0.0.1:5100/transaction/' + cID + "/" + month);
    let secondAPICall = fetch('http://127.0.0.1:5100/transaction/' + cID);
    Promise.all([firstAPICall, secondAPICall])
      .then(values => Promise.all(values.map(value => value.json())))
      .then(data => {
        
        // let roundup = data[0].data.roundup.toFixed(2)
        let roundup = data[0].data.roundup
        let customerTransactions = data[1].customer
        console.log(customerTransactions)

        this.setState({monthRoundUp : roundup, customerTransactions: customerTransactions})
      })
  }

  toMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);
  
    return date.toLocaleString('en-US', {
      month: 'long',
    });
  }

  fix2dp(num) {
    return Number(num).toFixed(2)
  }


  render() {
    return (
      <Flex>
        {/* SIDENAV */}
        <Sidenav dashboardLink="#"/>

        {/* MAIN DASHBOARD FLEX */}
        <Flex
          flexDir="column"
          ml={10}
          mt={10}>
            <Flex
              h="15vh"
              pt={10}
              >
              <Button
              as={Link}
              color="white" 
              bg="black"
              _hover={{boxShadow: "2px 2px 5px #68D391;"}}
              to= {'/payment?cID=' + this.state.cID}
              >
              Make Payment
              </Button>
            </Flex>

        {/* Savings */}
        <Flex
          flexDir="column"
          mb={5}
          >
          <Flex
            mb={2}
            >
            <Text
              fontSize='3xl'
              fontWeight="bold"
              >
              Savings
            </Text>
          </Flex>

          <Flex
            bg="gray.100"
            w="60%"
            borderRadius="15px"
            >
          <StatGroup
            m={5}
            >
            <Stat>
              <StatLabel w="150px">Total</StatLabel>
              <StatNumber>345,670</StatNumber>
            </Stat>

            <Stat
              // ml={20}
              >
              <StatLabel w="250px">{this.toMonthName(this.state.month)}'s Savings</StatLabel>              
              <StatNumber>${this.fix2dp(this.state.monthRoundUp)}</StatNumber>
            </Stat>
          </StatGroup>
          </Flex>
        </Flex>

        {/* Transactions */}
            <Flex
              flexDir="column"
              mb={5}
              >
              <Flex>
                <Text
                  fontSize='3xl'
                  fontWeight="bold"
                  mb={2}
                  >
                  Transactions
                </Text>
              </Flex>

              <Flex
                bg="gray.100"
                w="100%"
                borderRadius="15px"
                >
              <TableContainer
                my={2}
                >
                <Table 
                variant='simple'
                height = "250px"
                display = "block"
                overflowY = "auto"
                >
                  <Thead>
                    <Tr>
                      <Th>Transaction ID</Th>
                      <Th>Date</Th>
                      <Th isNumeric>Payment Value</Th>
                      <Th isNumeric>Round Up</Th>
                      <Th isNumeric>Total Value</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {/* Loop/map here */}
                    {this.state.customerTransactions
                      .map((transaction, index) => 
                        <Tr key={index}>
                          <Td>{transaction.transaction_id}</Td>
                          <Td>{transaction.transaction_date}</Td>
                          <Td isNumeric>${this.fix2dp(transaction.value_before)}</Td>
                          <Td isNumeric>${this.fix2dp(transaction.value_roundup)}</Td>
                          <Td isNumeric>$ {this.fix2dp(transaction.value_after)}</Td>
                          </Tr>)
                    }
                  </Tbody>
                </Table>
              </TableContainer>
              </Flex>
            </Flex>


        </Flex>
      </Flex>
    )
  }
}


export default Dashboard;
