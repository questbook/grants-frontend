import { useState } from 'react'
import { Box, Button, Flex, Text } from '@chakra-ui/react'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import ImageUpload from 'src/libraries/ui/ImageUpload'

interface Props {
    domainName: string
    setDomainName: (domainName: string) => void
    domainImage: File
    setDomainImage: (domainImage: File) => void
    step: number
    setIsOpen: (value: boolean) => void
    createWorkspace: () => void
}

function BuilderDiscovery({ domainName, setDomainName, setDomainImage, setIsOpen, createWorkspace }: Props) {

	const buildScreen = () => {

		return (
			<Flex
				alignItems='center'
				direction='column'
				width='100%'
				gap={12}
				alignSelf='flex-start'
				marginTop={8}
			>

				{/* Screen Heading */}
				<Flex
					direction='column'
					alignItems='center'
					width='100%'
					gap={2}>
					<Text
						variant='v2_heading_3'
						fontWeight='500'>
						How can builders find your grants?
					</Text>
					<Text>
						Customize how builders can discover you on the Discover feed
					</Text>
				</Flex>


				{/* Input Card */}
				<Flex
					width='100%'
					alignItems='center'
					direction='column'>
					<Box
						display='flex'
						flexDirection='column'
						border='1px solid #E7E4DD'
						gap={6}
						pt={8}
						p={6}>
						<ImageUpload
							imageFile={{ file: domainLogoFile }}
							setImageFile={
								(f) => {
									setDomainLogoFile(f.file)
								}
							} />
						<Flex direction='column'>
							<FlushedInput
								placeholder='Name'
								width='100%'
								textAlign='start'
								value={domainName}
								onChange={(e) => setDomainName(e.target.value)}
								// helperText='Examples: Uniswap Foundation. Polygon Village DAO. Celo Climate Collective'
							/>
							<Text
								variant='v2_body'
								color='gray.5'>
								Examples: Uniswap Foundation. Polygon Village DAO. Celo Climate Collective
							</Text>
						</Flex>
					</Box>
				</Flex>

				{/* CTA button */}
				<Button
					variant='primaryMedium'
					isDisabled={!domainName}
					h='48px'
					w='166px'
					onClick={
						() => {
							setDomainImage(domainLogoFile!)
							createWorkspace()
							setIsOpen(true)
						}
					}
				>
					Create
				</Button>
			</Flex>
		)
	}

	const [domainLogoFile, setDomainLogoFile] = useState<File | null>(null)

	return buildScreen()
}

export default BuilderDiscovery