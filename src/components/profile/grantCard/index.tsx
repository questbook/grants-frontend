
import React from 'react'
import {
<<<<<<< HEAD
  Image, Text, Button, Flex, Box, Stack, Link,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { SupportedChainId } from 'src/constants/chains';
import { CHAIN_INFO } from 'src/constants/chainInfo';
import VerifiedBadge from 'src/components/ui/verified_badge';
import Badge from './badge';
import moment from 'moment';
=======
	Box, Button, Divider, Flex, Image, Link,
	Text, } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import VerifiedBadge from 'src/components/ui/verified_badge'
import { CHAIN_INFO } from 'src/constants/chainInfo'
import { SupportedChainId } from 'src/constants/chains'
import Badge from './badge'
>>>>>>> master

interface BrowseGrantCardProps {
  daoID: string;
  daoName: string;
  createdAt: number;
  isDaoVerified?: boolean;
  chainId: SupportedChainId | undefined;

  grantTitle: string;
  grantDesc: string;
  isGrantVerified?: boolean;
  funding: string;

  numOfApplicants: number;
  endTimestamp: number;

  grantAmount: string;
  grantCurrency: string;
  grantCurrencyIcon: string;

  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onTitleClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

function BrowseGrantCard({
<<<<<<< HEAD
  daoID,
  daoName,
  createdAt,
  isDaoVerified,
  chainId,
=======
	daoID,
	daoIcon,
	daoName,
	isDaoVerified,
	chainId,
>>>>>>> master

	grantTitle,
	grantDesc,
	isGrantVerified,
	funding,

	numOfApplicants,
	endTimestamp,

	grantAmount,
	grantCurrency,
	grantCurrencyIcon,

	onClick,
	onTitleClick,
}: BrowseGrantCardProps) {
	const router = useRouter()

<<<<<<< HEAD
  const dateFromCreation = new Date(createdAt).toString();
  const currentDate = (new Date()).getTime();

  console.log(currentDate)

  return (
    <Flex
      borderY="1px solid #E8E9E9"
    >
      <Flex
      py={6} px="1.5rem" w="100%">

        <Flex flex={1} direction="column">

          <Flex direction="row" alignItems="center">
            <Text maxW="50%">
              <Link
                onClick={onTitleClick}
                whiteSpace="normal"
                textAlign="left"
                lineHeight="26px"
                fontSize="18px"
                fontWeight="700"
                color="#12224"
              >
                {grantTitle}
              </Link>
            </Text>

            <Image mx={2} src="/ui_icons/green_dot.svg" display="inline-block" />

            <Text fontSize="0.75rem" lineHeight="1rem" fontWeight="700" color="#8C8C8C">
              {dateFromCreation}
            </Text>

            <Box mr="auto" />
            <Badge
              numOfApplicants={numOfApplicants}
            />
          </Flex>

          <Text mt={5} lineHeight="24px" color="#122224" fontWeight="400">
            {grantDesc}
          </Text>

          <Flex direction="row" mt={8} alignItems="center">

            <Stack
              bgColor="#F5F5F5"
              borderRadius="1.25rem"
              h="1.5rem"
              px="0.5rem"
              justify="center"
            >
              <Text fontSize="0.85rem" lineHeight="1rem" fontWeight="400" color="#373737">
              ${grantAmount}/grantee
              </Text>
              {isGrantVerified && (
              <VerifiedBadge
                grantAmount={funding}
                grantCurrency={grantCurrency}
                lineHeight="26px"
                marginBottom={-1}
              />
              )}
            </Stack>

            <Image mx={2} src="/ui_icons/green_dot.svg" display="inline-block" />
            <Image src={grantCurrencyIcon} />
            <Text ml={2} fontSize="0.85rem" lineHeight="1rem" fontWeight="400" color="#373737">
              Paid in {" "}<b>{grantCurrency}</b>
            </Text>
            <Image mx={2} src="/ui_icons/green_dot.svg" display="inline-block" />

            <Image mr="6px" boxSize={3} src="/ui_icons/deadline.svg" display="inline-block" />
            <Text fontSize="0.85rem" lineHeight="1rem" display="inline-block">
              Ends on
              {' '}
              <b>{moment(endTimestamp).format('MMMM D')}</b>
            </Text>

            <Box mr="auto" />
            <Button onClick={onClick} variant="primaryCta" h="105px">
              Apply Now
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
=======
	return (
		<>
			<Flex
				py={6}
				w="100%">
				<Image
					objectFit="cover"
					h="54px"
					w="54px"
					src={daoIcon} />
				<Flex
					flex={1}
					direction="column"
					ml={6}>
					<Flex
						direction="row"
						alignItems="start">
						<Text maxW="50%">
							<Link
								onClick={onTitleClick}
								whiteSpace="normal"
								textAlign="left"
								lineHeight="26px"
								fontSize="18px"
								fontWeight="700"
								color="#12224"
							>
								{grantTitle}
							</Link>
							{
								isGrantVerified && (
									<VerifiedBadge
										grantAmount={funding}
										grantCurrency={grantCurrency}
										lineHeight="26px"
										marginBottom={-1}
									/>
								)
							}
						</Text>

						<Box mr="auto" />
						<Badge
							numOfApplicants={numOfApplicants}
							endTimestamp={endTimestamp}
						/>
					</Flex>

					<Flex direction="row">
						<Link
							onClick={
								() => {
									router.push({
										pathname: '/profile',
										query: {
											daoId: daoID,
											chainId,
										},
									})
								}
							}
							lineHeight="24px"
							fontWeight="700"
						>
							{daoName}
							{
								isDaoVerified && (
									<Image
										h={4}
										w={4}
										display="inline-block"
										src="/ui_icons/verified.svg"
										ml="2px"
										mb="-2px"
									/>
								)
							}
						</Link>
						<Text
							fontSize="16px"
							display="inline"
							color="#717A7C"
							fontWeight="400"
							lineHeight="24px"
							ml={2}>

							{`• ${CHAIN_INFO[chainId!]?.name}`}
						</Text>
					</Flex>

					<Text
						mt={5}
						lineHeight="24px"
						color="#122224"
						fontWeight="400">
						{grantDesc}
					</Text>

					<Flex
						direction="row"
						mt={8}
						alignItems="center">
						<Image src={grantCurrencyIcon} />
						<Text
							ml={2}
							fontWeight="700"
							color="#3F06A0">
							{grantAmount}
							{' '}
							{grantCurrency}
						</Text>
						<Box mr="auto" />
						<Button
							onClick={onClick}
							variant="primaryCta">
              Apply Now
						</Button>
					</Flex>
				</Flex>
			</Flex>
			<Divider w="auto" />
		</>
	)
>>>>>>> master
}

BrowseGrantCard.defaultProps = {
	isGrantVerified: false,
	isDaoVerified: false,
	onClick: () => {},
	onTitleClick: () => {},
}
export default BrowseGrantCard
