import React from 'react'
import { 
  Container, 
  Box, 
  Text,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels, 
} from "@chakra-ui/react"
import Signup from '../components/Auth/Signup'
import Login from '../components/Auth/Login'
import { useHistory } from 'react-router-dom'
import { useEffect } from 'react'

const Home = () => {

  const history = useHistory()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) history.push("/chats")
  }, [history])

  return (
    <Container maxW='xl' centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="md"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontWeight={900} fontFamily="Work sans">
          Gup-Shup
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default Home