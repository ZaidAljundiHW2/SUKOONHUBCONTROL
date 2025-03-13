import { useEffect, useState } from 'react'
import { Box, HStack, Text, Button, VStack } from '@chakra-ui/react'
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'

const auth = getAuth();
const db = getFirestore();

interface Hub {
  id: string
  [key: string]: any
}

const HubDevicesDisplay = () => {
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [selectedHub, setSelectedHub] = useState<Hub | null>(null);

  useEffect(() => {
    const fetchHubs = async () => {
      try {
        const hubsCollection = collection(db, 'hubs')
        const hubSnapshot = await getDocs(hubsCollection)
        const hubsList = hubSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setHubs(hubsList)
      } catch (error) {
        console.error('Error fetching hubs:', error)
      }
    }

    fetchHubs()
  }, [])

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minH="100vh" p={4}>
      <Box width="100%" maxW="1200px" bg="gray.50" borderRadius="lg" boxShadow="md" p={6}>
        <HStack align="start" spaceX={6} height="600px" overflow="hidden">
          {/* Hub List */}
          <Box 
            width="300px" 
            bg="white" 
            borderRadius="md" 
            p={4}
            overflowY="auto"
            boxShadow="sm"
          >
            <VStack spaceY={3} align="stretch">
              <Text fontSize="xl" fontWeight="bold">Hubs</Text>
              {hubs.map((hub) => (
                <Button
                  key={hub.id}
                  onClick={() => setSelectedHub(hub)}
                  variant={selectedHub?.id === hub.id ? 'solid' : 'outline'}
                  colorScheme="blue"
                  justifyContent="left"
                  textAlign="left"
                  whiteSpace="normal"
                  height="auto"
                  py={2}
                >
                  <Text>{hub.name || `Hub ${hub.id}`}</Text>
                </Button>
              ))}
            </VStack>
          </Box>

          {/* Hub Details */}
          <Box 
            flex={1} 
            bg="white" 
            borderRadius="md" 
            p={6}
            boxShadow="sm"
            overflowY="auto"
          >
            {selectedHub ? (
              <VStack align="stretch" spaceY={4}>
                <Text fontSize="2xl" fontWeight="bold">
                  {selectedHub.name || `Hub ${selectedHub.id}`}
                </Text>
                <Box>
                  <Text fontWeight="semibold">Hub ID:</Text>
                  <Text fontFamily="monospace" p={2} bg="gray.100" borderRadius="md">
                    {selectedHub.id}
                  </Text>
                </Box>
                {Object.entries(selectedHub).map(([key, value]) => (
                  key !== 'id' && (
                    <Box key={key}>
                      <Text fontWeight="semibold">{key}:</Text>
                      <Text 
                        p={2} 
                        bg="gray.50" 
                        borderRadius="md" 
                        fontFamily={typeof value === 'object' ? 'monospace' : 'inherit'}
                      >
                        {typeof value === 'object' 
                          ? JSON.stringify(value, null, 2) 
                          : value}
                      </Text>
                    </Box>
                  )
                ))}
              </VStack>
            ) : (
              <Box 
                display="flex" 
                alignItems="center" 
                justifyContent="center" 
                height="100%"
              >
                <Text fontSize="lg" color="gray.500">
                  Select a hub to view details
                </Text>
              </Box>
            )}
          </Box>
        </HStack>
      </Box>
    </Box>
  )
}

export default HubDevicesDisplay