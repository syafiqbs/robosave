import React from 'react';

// import styles from './dashboard.module.css';

// Components
import Sidenav from '../sidenav/sidenav';

// Chakra UI imports
import { Flex, Text, Button, Table, Thead,Tbody,Tfoot,Tr,Th,Td,TableCaption,TableContainer,   Stat,StatLabel,StatNumber,StatHelpText,StatArrow,StatGroup, } from '@chakra-ui/react'
import {  } from '@chakra-ui/icons'



class Dashboard extends React.Component {
  state = {
    
  }


  render() {
    return (
      <Flex>
        {/* SIDENAV */}
        <Sidenav/>

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
              color="white" 
              bg="black"
              _hover={{boxShadow: "2px 2px 5px #68D391;"}}>
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
            w="50%"
            borderRadius="15px"
            >
          <StatGroup
            m={5}
            >
            <Stat>
              <StatLabel>Total Savings</StatLabel>
              <StatNumber>345,670</StatNumber>
            </Stat>

            <Stat
              ml={20}
              >
              <StatLabel>Clicked</StatLabel>
              <StatNumber>45</StatNumber>
              <StatHelpText>
                January
              </StatHelpText>
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
