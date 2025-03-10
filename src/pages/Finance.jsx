import { Box, Container, Heading, SimpleGrid, Card, CardBody, Stat, StatLabel, StatNumber, StatHelpText, useColorModeValue } from '@chakra-ui/react';

const Finance = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Box bg={bgColor} minH="100vh" p={4}>
      <Container maxW="container.xl">
        <Heading mb={6}>Finanças</Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          <Card bg={cardBg} _hover={{ transform: 'translateY(-5px)' }} transition="all 0.2s">
            <CardBody>
              <Stat>
                <StatLabel>Dízimos</StatLabel>
                <StatNumber>R$ 0,00</StatNumber>
                <StatHelpText>Este mês</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} _hover={{ transform: 'translateY(-5px)' }} transition="all 0.2s">
            <CardBody>
              <Stat>
                <StatLabel>Ofertas</StatLabel>
                <StatNumber>R$ 0,00</StatNumber>
                <StatHelpText>Este mês</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} _hover={{ transform: 'translateY(-5px)' }} transition="all 0.2s">
            <CardBody>
              <Stat>
                <StatLabel>Total</StatLabel>
                <StatNumber>R$ 0,00</StatNumber>
                <StatHelpText>Este mês</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default Finance;