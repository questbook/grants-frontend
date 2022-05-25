import React from 'react'
import {
	Button, Container, Flex, Image,
	Link, Text, useTheme, } from '@chakra-ui/react'
import strings from '../../constants/strings.json'
import { highlightWordsInString } from '../../utils/formattingUtils'

function GetStarted({
	onTalentClick,
	onDaoClick,
}: {
  onTalentClick: () => void;
  onDaoClick: () => void;
}) {
	const theme = useTheme()

	const tabs = [
		{
			id: 'dev',
			icon: '/illustrations/developer_illustration.svg',
			text: highlightWordsInString(
				strings.get_started.talent.text,
				strings.get_started.talent.highlight,
				theme.colors.brand[500],
			),
			onClick: () => onTalentClick(),
		},
		{
			id: 'dao',
			icon: '/illustrations/dao_illustration.svg',
			text: highlightWordsInString(
				strings.get_started.dao.text,
				strings.get_started.dao.highlight,
				theme.colors.brand[500],
			),
			onClick: () => onDaoClick(),
		},
	]
	return (
		<Container
			maxW="100%"
			display="flex"
			px="70px"
			flexDirection="column"
			alignItems="center"
		>
			<Text
				mt="46px"
				variant="heading"
				textAlign="center">
				{strings.get_started.heading}
			</Text>
			<Text
				mt="42px"
				variant="heading"
				textAlign="center">
				{strings.get_started.subheading}
			</Text>
			<Flex
				mt={20}
				justify="space-evenly"
				w="80%">
				{
					tabs.map(({ id, icon, text, onClick }) => (
						<Flex
							key={id}
							direction="column"
							justify="start"
							align="center"
							mx={4}>
							<Image
								h="153px"
								w="202px"
								src={icon} />
							<Text
								mt={10}
								fontWeight="400"
								textAlign="center">
								{text}
							</Text>
							<Button
								onClick={onClick}
								mt={10}
								variant="primary">
								{strings.get_started.button_text}
							</Button>
						</Flex>
					))
				}
			</Flex>

			<Text
				variant="footer"
				mt="51px"
				mb="35px">
				<Link href="/connect_wallet">
					{strings.get_started.footer.link}
				</Link>
				{' '}
				{strings.get_started.footer.text}
			</Text>
		</Container>
	)
}

export default GetStarted
