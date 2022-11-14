import React from "react";

import styles from './financialNews.module.css';

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
  VStack, StackDivider, Box, Image 
} from "@chakra-ui/react";


class FinancialNews extends React.Component {
  state = {
    description: "",
    accountTo: "",
    accountFrom: "",
    cID: "",
    bankAccounts: [],
    organizations : [],
    transactionMessage: "",
    financialNews: [
      {
          "uuid": "",
          "title": "",
          "description": "",
          "keywords": "",
          "snippet": "Seat 1: Sungai Buloh\n\nA vote for the party or the candidate?\n\nAfter the dissolution of Parliament, The Edge reached out to Khairy Jamaluddin for his views on GE...",
          "url": "",
          "image_url": "",
          "language": "",
          "published_at": "",
          "source": "",
          "relevance_score": '',
          "entities": []
      }
    ]
  };



  componentDidMount() {
    let params = new URLSearchParams(document.location.search);
    let cID = params.get("cID");
    if (cID) {this.setState({ cID: cID})}

    const customerInformation = JSON.parse(sessionStorage.getItem("customerInformation"))
    const bankAccounts = customerInformation.customerAccounts.account
    this.setState({customerAccounts: customerInformation.customerAccounts, customerDetails: customerInformation.customerDetails, bankAccounts: bankAccounts})

    fetch(('https://api.marketaux.com/v1/news/all?language=en&limit=3&api_token=redKCJBblXktRMf6SlVTua0PTPt5MuD9ZPLQQKxT'))
      .then(response => response.json())
      .then(data => {
        // console.log(data.data)
        this.setState({financialNews: data.data})
      });

  }

  render() {

    return (
      <Flex>
        {/* SIDENAV */}
        <Sidenav dashboardLink={"/dashboard?cID=" + this.state.cID} investLink={`/invest?cID=${this.state.cID}`} />

        {/* MAIN DASHBOARD FLEX */}
        <Flex flexDir="column">

        {/* FINANCIAL NEWS */}
        <Flex
            flexDir="column"
            bg="gray.100"
            borderRadius="15px"
            px={10}
            py={5}
            ml={"20"}
            mt={"30"}
            mb={"5"}
            w= "800px"
          >
            <Text fontSize="3xl" fontWeight="bold" align="center" mb={10}>
              Financial News
            </Text>
            <VStack
            divider={<StackDivider borderColor='gray.200' />}
            // spacing={40}
            align='stretch'
          >
            { this.state.financialNews
              .map((news, index) => 
                  <Flex key={index}
                  >
                    <Box mr="5" mt="2"><Image  src={news.image_url} maxWidth="20" minWidth="20"></Image ></Box>
                    <Box mb="20">
                      <Text fontSize='20px' as='u'><a href={news.url}><b>{news.title}</b></a></Text>
                      <Text>{news.description}</Text>
                      <Text fontSize='8px'>{news.source} | {news.published_at}</Text>
                    </Box>
                  </Flex>
              )
            }
            
          </VStack>
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

export default FinancialNews;
