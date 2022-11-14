import React from "react";

// import styles from './sidenav.module.css';

// Chakra UI imports
import {
  Flex,
  Text,
  Link,
  IconButton,
  Menu,
  MenuButton,
  Divider,
} from "@chakra-ui/react";
import { HamburgerIcon, DragHandleIcon } from "@chakra-ui/icons";

class Sidenav extends React.Component {
  state = {
    smallNav: false,
  };

  changeNavSize = () => {
    if (this.state.smallNav === true) {
      this.setState({ smallNav: false });
    } else {
      this.setState({ smallNav: true });
    }
  };

  clearSessionLogout() {
    sessionStorage.clear();
    window.location.href = "/";
  }

  render() {
    return (
      <Flex>
        <Flex
          pos="sticky"
          left="0"
          h="100vh"
          boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
          borderRadius={
            this.state.smallNav === true ? "0 15px 0 0" : "0 30px 0 0"
          }
          w={this.state.smallNav === true ? "75px" : "200px"}
          bg="blackAlpha.900"
          flexDir="column"
          justifyContent="space-between">
          {/* LINKS */}
          <Flex
            p="5%"
            flexDir="column"
            alignItems={this.state.smallNav === true ? "center" : "flex-start"}
            as="nav">
            <IconButton
              icon={<HamburgerIcon />}
              color="white"
              background="none"
              mt={5}
              _hover={{ color: "black", backgroundColor: "#68D391" }}
              onClick={this.changeNavSize}></IconButton>
            {/* ONE NAV LINK */}
            <Flex
              mt={30}
              flexDir="column"
              w="100%"
              alignItems={
                this.state.smallNav === true ? "center" : "flex-start"
              }>
              <Menu placement="right">
                <Link
                  backgroundColor="none"
                  color="white"
                  p={2}
                  borderRadius={8}
                  _hover={{ color: "black", backgroundColor: "#68D391" }}
                  w={this.state.smallNav === false && "100%"}
                  href={this.props.dashboardLink}>
                  <MenuButton>
                    <Flex>
                      <DragHandleIcon />
                      <Text
                        ml={2}
                        display={
                          this.state.smallNav === true ? "none" : "flex"
                        }>
                        Dashboard
                      </Text>
                    </Flex>
                  </MenuButton>
                </Link>
              </Menu>
            
              <Menu placement="right">
                <Link
                  backgroundColor="none"
                  color="white"
                  p={2}
                  borderRadius={8}
                  _hover={{ color: "black", backgroundColor: "#68D391" }}
                  w={this.state.smallNav === false && "100%"}
                  href={this.props.investLink}>
                  <MenuButton>
                    <Flex>
                      <DragHandleIcon />
                      <Text
                        ml={2}
                        display={
                          this.state.smallNav === true ? "none" : "flex"
                        }>
                        Invest
                      </Text>
                    </Flex>
                  </MenuButton>
                </Link>
              </Menu>
              <Menu placement="right">
                <Link
                  backgroundColor="none"
                  color="white"
                  p={2}
                  borderRadius={8}
                  _hover={{ color: "black", backgroundColor: "#68D391" }}
                  w={this.state.smallNav === false && "100%"}
                  href={this.props.financialLink}>
                  <MenuButton>
                    <Flex>
                      <DragHandleIcon />
                      <Text
                        ml={2}
                        display={
                          this.state.smallNav === true ? "none" : "flex"
                        }>
                        Financial News
                      </Text>
                    </Flex>
                  </MenuButton>
                </Link>
              </Menu>
            </Flex>
          </Flex>

          {/* SIGN OUT */}
          <Flex
            p="5%"
            flexDir="column"
            w="100%"
            alignItems="center"
            mb={4}
            display={this.state.smallNav === true ? "none" : "flex"}>
            <Divider />
            <Flex mt={4} align="center">
              <Link
                backgroundColor="none"
                color="white"
                // p={2}
                // borderRadius={8}
                w={this.state.smallNav === false && "100%"}
                href="/"
                onClick={this.clearSessionLogout}>
                <Flex>
                  <Flex flexDir="column">
                    <Text>Sign Out</Text>
                  </Flex>
                </Flex>
              </Link>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    );
  }
}

export default Sidenav;
