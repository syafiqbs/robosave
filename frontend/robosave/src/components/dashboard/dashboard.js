import React from 'react';

// import styles from './dashboard.module.css';

// Components
import Sidenav from '../sidenav/sidenav';

// Chakra UI imports
import { Flex, Text } from '@chakra-ui/react'
import {  } from '@chakra-ui/icons'



class Dashboard extends React.Component {
  state = {
    
  }


  render() {
    return (
      <Flex>
        {/* SIDENAV */}
        <Sidenav/>
        <Flex>
          <Text>Dashboard HERE</Text>
        </Flex>
      </Flex>
    )
  }
}


export default Dashboard;
