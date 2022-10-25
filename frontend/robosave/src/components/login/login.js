import React from 'react';

import styles from './login.module.css';
import { Text } from '@chakra-ui/react'


class Login extends React.Component {
  render() {
    return (
      <div className={styles.body}>
        <Text fontSize='3xl' as='b'>Welcome to Robosave</Text>
      </div>
    )
  }
}


export default Login;
