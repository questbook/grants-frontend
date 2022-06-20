/* eslint-disable react/no-unstable-nested-components */
// @TODO: Fix this ESLint issue
import React, { useEffect, useState } from 'react'
import Linkify from 'react-linkify'
import {
	Box, Link, Skeleton,
	Text, } from '@chakra-ui/react'
import TextViewer from 'src/components/ui/forms/richTextEditor/textViewer'
import { getFromIPFS } from 'src/utils/ipfsUtils'

function GrantDetails({
	grantSummary,
	grantDetails,
}: {
  grantSummary: string;
  grantDetails: string;
}) {
	const [decodedDetails, setDecodedDetails] = useState('')
	const getDecodedDetails = async(detailsHash: string) => {
		console.log(detailsHash)
		const d = await getFromIPFS(detailsHash)
		setDecodedDetails(d)
	}

	useEffect(() => {
		if(!grantDetails) {
			return
		}

		if(grantDetails.length) {
			getDecodedDetails(grantDetails)
		} else {
			setDecodedDetails(grantDetails)
		}

		console.log(grantDetails)
	}, [grantDetails])

	return (
		<>
			<Text
				mt={7}
				variant="heading"
				fontSize="18px"
				lineHeight="26px"
				color="#8347E5"
			>
        About Grant
			</Text>

			<Text
				mt={4}
				variant="heading"
				fontSize="16px"
				lineHeight="24px">
        Summary
			</Text>
			<Text
				mt={3}
				fontWeight="400">
				{grantSummary}
			</Text>

			<Text
				mt={4}
				variant="heading"
				fontSize="16px"
				lineHeight="24px">
        Details
			</Text>
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
					mt={3}
					fontWeight="400">
					{
						decodedDetails !== '' ? (
							<TextViewer
							// value={useMemo(() => EditorState.createWithContent(
							//   convertFromRaw(JSON.parse(grantDetails)),
							// ), [grantDetails])}
							// value={editorState}
							// onChange={setEditorState}
								text={decodedDetails}
							/>
						) : <Skeleton />
					}
					{/* <div
          className="richTextContainer"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html:  }}
        /> */}
				</Box>
			</Linkify>
		</>
	)
}

export default GrantDetails
