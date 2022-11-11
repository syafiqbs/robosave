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
    aID: ""
  }

  componentDidMount() {
    let params = new URLSearchParams(document.location.search);
    let aID = params.get("aID");
    if (aID) {this.setState({ aID: aID })} // to do a no account redirect
    
    const customerInformation = JSON.parse(sessionStorage.getItem("customerInformation"))
    this.setState({customerAccounts: customerInformation.customerAccounts, customerDetails: customerInformation.customerDetails})

    let month = new Date().getMonth() + 1
    this.setState({month: month})

    let firstAPICall = fetch('http://127.0.0.1:5100/transaction/' + customerInformation.customerDetails.taxIdentifier + "/" + month);
    // let secondAPICall = fetch('http://127.0.0.1:5000/job_role_skill_map/' + role_id);
    Promise.all([firstAPICall])
      .then(values => Promise.all(values.map(value => value.json())))
      .then(data => {
        let roundup = data[0].data.roundup.toFixed(2)
        this.setState({monthRoundUp : roundup})
      })
  }

  toMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);
  
    return date.toLocaleString('en-US', {
      month: 'long',
    });
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
              to= {'/payment?aID=' + this.state.aID}
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
            w="75%"
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
              ml={20}
              >
              <StatLabel w="150px">{this.toMonthName(this.state.month)}'s</StatLabel>              
              <StatNumber>${this.state.monthRoundUp}</StatNumber>
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
                <Table variant='simple'>
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
                    <Tr>
                      <Td>123456789</Td>
                      <Td>01/01/2022</Td>
                      <Td isNumeric>25.40</Td>
                      <Td isNumeric>0.60</Td>
                      <Td isNumeric>26.00</Td>
                    </Tr>
                    <Tr>
                      <Td>987654321</Td>
                      <Td>10/10/1010</Td>
                      <Td isNumeric>100.90</Td>
                      <Td isNumeric>0.90</Td>
                      <Td isNumeric>101.00</Td>
                    </Tr>
                    <Tr>
                      <Td>123012929</Td>
                      <Td>20/20/2020</Td>
                      <Td isNumeric>9.50</Td>
                      <Td isNumeric>0.50</Td>
                      <Td isNumeric>10.00</Td>
                    </Tr>
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
