import React from 'react';

import styles from './dashboard.module.css';

// Chakra UI imports
import { Flex, Spacer, Center, Text, FormControl, FormLabel,Grid, GridItem, Input, Box, Button, SimpleGrid, Link, IconButton, Menu, MenuButton, MenuList, MenuItem, MenuItemOption, MenuGroup, MenuOptionGroup, MenuDivider, Icon,  } from '@chakra-ui/react'
import { HamburgerIcon, DragHandleIcon } from '@chakra-ui/icons'

import blackLogo from "../../assets/black-logo.png";


class Dashboard extends React.Component {
  state = {
    smallNav: false
  }

  changeNavSize = () => {
    if (this.state.smallNav === true) {
      this.setState({smallNav: false})
    } else {
      this.setState({smallNav: true})
    }
  }

  render() {
    return (
      <Flex
        pos="sticky"
        left="0"
        h="100vh"
        boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
        borderRadius={this.state.smallNav === true ? "0 15px 0 0" : "0 30px 0 0"}
        w={this.state.smallNav === true ? "75px" : "200px"}
        bg="blackAlpha.900"
        flexDir="column"
        justifyContent="space-between"
      >
  {/* LINKS */}
      <Flex
        p="5%"
        flexDir="column"
        alignItems={this.state.smallNav === true ? "center" : "flex-start"}
        as="nav">
          <IconButton
            icon = {<HamburgerIcon/>}
            color="white"
            background="none"
            mt={5}
            _hover={{color: 'black', backgroundColor: "#68D391"}}
            onClick={this.changeNavSize}>
          </IconButton>

      {/* ONE NAV LINK */}
          <Flex
            mt={30}
            flexDir="column"
            w="100%"
            alignItems={this.state.smallNav === true ? "center" : "flex-start"}
            >
              <Menu placement='right'>
                <Link
                  backgroundColor="none"
                  color="white"
                  p={2}
                  borderRadius={8}
                  _hover={{color: 'black', backgroundColor: "#68D391"}}
                  w={this.state.smallNav === false && "100%"}
                  href=''>
                <MenuButton>
                    <Flex>
                      <DragHandleIcon/>
                      <Text ml={2} display={this.state.smallNav === true ? "none" : "flex"}>Dashboard</Text>
                    </Flex>
                </MenuButton>
                </Link>
              </Menu>
          </Flex>

      </Flex>

      </Flex>
    )
  }
}


export default Dashboard;
