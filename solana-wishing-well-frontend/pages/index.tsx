
import { Center, Box, Heading, Button } from '@chakra-ui/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { AppBar } from '../components/AppBar'
import { WishList } from '../components/WishList'
import { Form } from '../components/Form'
import styles from '../styles/Home.module.css'
import Image from 'next/image'

const Home: NextPage = () => {
  return (
    <div className={styles.App}>
      <Head>
        <title>Wish Lists</title>
      </Head>
      <AppBar />
      <Center style={{backgroundColor: "white"}}>       
        <Box>
          <Heading as="h1" size="l" color="white" ml={4} mt={8}>
            Blockhain-based Wishing
          </Heading>
          <Form />
          <Heading as="h1" size="l" color="white" ml={4} mt={8}>
            Existing Wishes
          </Heading>
          <WishList />
        </Box>
      </Center>
    </div>
  )
}

export default Home
