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
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'

interface DaoAboutProps {
  daoAbout?: string
  daoPartners?: any
}

function DaoAbout({ daoAbout, daoPartners }: DaoAboutProps) {

	return (
		<Flex
			borderRight='1px solid #E8E9E9'
			p='1.5rem'
			w='100%'
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
					w='100%'

					mt={3}
					fontWeight='400'>
					{
						daoAbout !== '' ? (
							<TextViewer
								text={daoAbout!}
							/>
						) : <Skeleton />
					}
				</Box>
			</Linkify>
		</Flex>
	)
}

export default DaoAbout
