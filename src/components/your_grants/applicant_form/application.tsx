import {
  Flex, Divider, Button, Image, Text, Heading, Box, Link,
} from '@chakra-ui/react';
import React, { useRef, useState } from 'react';

function Application() {
  const [selected, setSelected] = useState(0);

  const scroll = (ref: any, currentSelection: number) => {
    if (!ref.current) return;
    ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    setSelected(currentSelection);
  };

  const refs = [useRef(null), useRef(null), useRef(null)];
  const tabs = ['Project Details', 'Funds Requested', 'About Team'];

  return (
    <>
      <Flex mt="8px" direction="column" w="full">
        <Divider />
        <Flex direction="row" w="full" justify="space-evenly" h={14} align="stretch" mb={8}>
          {tabs.map((tab, index) => (
            <Button
              variant="ghost"
              h="54px"
              w="full"
              _hover={{
                background: '#F5F5F5',
              }}
              _focus={{}}
              borderRadius={0}
              background={selected === index ? '#E7DAFF' : 'white'}
              color={selected === index ? 'brand.500' : '#122224'}
              borderBottomColor={selected === index ? 'brand.500' : '#E7DAFF'}
              borderBottomWidth={selected === index ? '2px' : '1px'}
              onClick={() => scroll(refs[index], index)}
            >
              {tab}
            </Button>
          ))}
        </Flex>
      </Flex>
      <Flex direction="column" w="full">
        <Flex direction="column" w="full" mt={4}>
          <Heading variant="applicationHeading" ref={refs[0]}>Grant Title</Heading>
          <Text variant="applicationText" mt={2} mb={10}>Spock - Decentralised Sports stocks trading app</Text>
          <Heading variant="applicationHeading">Project Link</Heading>
          <Text variant="applicationText" mt={2} mb={10}>
            <Link href="https://github.com/">https://github.com/</Link>
          </Text>
          <Heading variant="applicationHeading">Project Details</Heading>
          <Text variant="applicationText" mt={2} mb={10}>
            Spock is a decentralised sports stock trading app to be deployed on the Harmony
            platform. Our idea was to build a platform where users can win rewards by
            predicting the performance of favourite players. Spock is a revolutionary fantasy
            game where one can buy and sell fantasy stocks of players. The better the player
            plays on the day, the price goes up, and vice versa. A users role is to predict
            the future performance of the players and build a portfolio accordingly.
            Players can use the ONE/SPOCK tokens to trade players from different sports
            as stocks. We have already developed the first prototype of the game and it is
            running on the Polygon testnet.
          </Text>
          <Heading variant="applicationHeading">Project Goals</Heading>
          <Text variant="applicationText" mt={2} mb={10}>
            Build a platform where users can win rewards by predicting the performance of
            favourite players. Players can use the ONE/SPOCK tokens to trade players from
            different sports as stocks.
          </Text>
          <Heading variant="applicationHeading" ref={refs[1]}>Project Milestones</Heading>
          <Flex direction="column" w="full" mt={3} mb={10}>
            <Heading variant="applicationHeading" mt={3}>Milestone 1</Heading>
            <Text variant="applicationText" mt={1}>Feature complete and deployed onto testnet</Text>
            <Flex direction="row" justify="start" mt={3}>
              <Image src="/images/dummy/Ethereum Icon.svg" />
              <Box ml={2} />
              <Flex direction="column" justify="center" align="start">
                <Heading variant="applicationHeading">Funding asked</Heading>
                <Text variant="applicationText">60 ETH ≈ 2500 USD </Text>
              </Flex>
            </Flex>
            <Box mt={4} />
            <Heading variant="applicationHeading" mt={3}>Milestone 2</Heading>
            <Text variant="applicationText" mt={1}>Feature complete and deployed onto testnet</Text>
            <Flex direction="row" justify="start" mt={3}>
              <Image src="/images/dummy/Ethereum Icon.svg" />
              <Box ml={2} />
              <Flex direction="column" justify="center" align="start">
                <Heading variant="applicationHeading">Funding asked</Heading>
                <Text variant="applicationText">60 ETH ≈ 2500 USD </Text>
              </Flex>
            </Flex>
          </Flex>

          <Heading variant="applicationHeading">Funding & Budget Breakdown</Heading>
          <Flex direction="row" justify="start" mt={3} mb={10}>
            <Image src="/images/dummy/Ethereum Icon.svg" />
            <Box ml={2} />
            <Flex direction="column" justify="center" align="start">
              <Heading variant="applicationHeading">Total funding asked</Heading>
              <Text variant="applicationText" color="brand.500">120 ETH</Text>
            </Flex>
          </Flex>

          <Heading variant="applicationHeading">Funding Breakdown</Heading>
          <Text variant="applicationText" mb={10}>We will be using the funds for hiring iOS engineer, and a designer. For marketing we might need funds later.</Text>

          <Heading variant="applicationHeading" ref={refs[2]}>About Team</Heading>
          <Heading variant="applicationHeading" mt={4}>
            Team Members -
            {' '}
            <Heading variant="applicationHeading" color="brand.500" display="inline-block">5</Heading>
          </Heading>
          <Heading variant="applicationHeading" color="brand.500" mt={5}>Member 1</Heading>
          <Text variant="applicationText" mt={2}>
            Undergrad - Computer Science, and freelancer. Here is the github profile:
            {' '}
            https://www.github.com
          </Text>
          <Heading variant="applicationHeading" color="brand.500" mt={5}>Member 2</Heading>
          <Text variant="applicationText" mt={2}>
            Undergrad - Computer Science, and freelancer. Here is the github profile:
            {' '}
            https://www.github.com
          </Text>
        </Flex>
        <Box my={10} />
      </Flex>
    </>
  );
}

export default Application;
