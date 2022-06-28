import React from 'react'
import Linkify from 'react-linkify'
import {
	Box,
	Flex,
	Grid,
	Image,
	Link,
	Skeleton,
	Text } from '@chakra-ui/react'
import TextViewer from 'src/components/ui/forms/richTextEditor/textViewer'

interface DaoAboutProps {
  daoAbout?: string;
  daoPartners?: any;
}

function DaoAbout({ daoAbout, daoPartners }: DaoAboutProps) {

	// const [decodedAbout, setDecodedAbout] = useState('')
	// const getDecodedAbout = async(detailsHash: string) => {
	// 	console.log(detailsHash)
	// 	const d = await getFromIPFS(detailsHash)
	// 	setDecodedAbout(d)
	// }

	// useEffect(() => {
	// 	if(!daoAbout) {
	// 		return
	// 	}

	// 	if(daoAbout.length) {
	// 		getDecodedAbout(daoAbout)
	// 	} else {
	// 		setDecodedAbout(daoAbout)
	// 	}

	// 	console.log(decodedAbout)
	// }, [daoAbout])

	return (
		<Grid
			gridTemplateColumns="3fr 1fr"
			px="1.5rem"
			w="100%"
			h="full">
			<Flex
				borderRight="1px solid #E8E9E9"
				p="1.5rem"
				w="100%"
			>
				<Linkify
					componentDecorator={
						(
							decoratedHref: string,
							decoratedText: string,
							key: number,
						) => (
							<Link
								key={key}
								href={decoratedHref}
								isExternal>
								{decoratedText}
							</Link>
						)
					}
				>
					<Box
						w="100%"

						mt={3}
						fontWeight="400">
						{
							daoAbout !== '' ? (
								<TextViewer
									text={daoAbout!}
								/>
							) : <Skeleton />
						}

						<embed
							src="https://localhost:3000/embed/?daoId=0x3&chainId=137"
							type="text/html"
							width="500"
							height="700"
						/>
					</Box>
				</Linkify>
			</Flex>
			<Flex
				p="1.5rem"
				direction="column"
				gap="1.5rem"
			>
				<Text
					fontSize="1.5rem"
					lineHeight="2rem"
					fontWeight="700"
					color="#122224"
				>
        Partners
				</Text>
				{
					daoPartners.length >= 1 &&
        daoPartners.map((partner: any, index: number) => (
        	<Grid
        		key={index}
        		gridTemplateColumns="1fr 1fr 1fr"
        		alignItems="center"
        		justifyContent="space-between"
        	>
        		<Image
        			h="3rem"
        			w="3rem"
        			borderRadius="full"
        			src="/illustrations/done.svg"
        		/>
        		<Flex
        			direction="column"
        		>
        			<Text
        				fontSize="1rem"
        				lineHeight="1.5rem"
        				fontWeight="700"
        				color="#191919"
        			>
        				{partner.name}
        			</Text>
        			<Text
        				fontSize="1rem"
        				lineHeight="1.25rem"
        				fontWeight="400"
        				color="#707070"
        			>
        				{partner.industry}
        			</Text>
        		</Flex>
        		{
        			partner.link && (
        				<Link
        					href={partner.link}
        					mt={2}
        					alignSelf="start"
        					isExternal
        				>
        					<Image
        						h="0.75rem"
        						w="0.75rem"
        						src="/ui_icons/link.svg"
        					/>
        				</Link>
        			)
        		}
        	</Grid>
        ))
				}
			</Flex>
		</Grid>
	)
}

export default DaoAbout
