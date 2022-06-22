import { useState } from 'react'
import { Box, Button, Flex, Heading, IconButton, Text } from '@chakra-ui/react'
import { GasStation } from 'src/v2/assets/custom chakra icons/GasStation'
import { ImageUploadIcon } from 'src/v2/assets/custom chakra icons/ImageUploadIcon'
import { Organization } from 'src/v2/assets/custom chakra icons/Organization'
import { NetworkSelectOption } from '../SupportedNetworksData'
import ContinueButton from '../UI/Misc/ContinueButton'

const CreateDaoFinal = ({
	daoName,
	daoNetwork
}: {
  daoName: string,
  daoNetwork: NetworkSelectOption
}) => {
	const [transactionFeesIsLoading, setTransactionFeesIsLoading] = useState(false)

	return (
		<>
			<Heading variant={'small'}>
        My DAO
			</Heading>
			<Flex mt={6}>
				<Box pos={'relative'}>
					<Button
						bg={'#C2E7DA'}
						boxSize={'72px'}
					>
						<Organization
							color={'#389373'}
							boxSize={8} />
					</Button>
					<IconButton
						bg={'white'}
						icon={<ImageUploadIcon />}
						aria-label={'upload dao icon image'}
						boxShadow={'0px 2px 4px rgba(31, 31, 51, 0.1)'}
						boxSize={'30px'}
						borderRadius={'30px'}
						minW={0}
						minH={0}
						pos={'absolute'}
						bottom={'-15px'}
						left={'calc(50% - 15px)'}
					/>
				</Box>
				<Flex
					ml={4}
					direction={'column'}>
					<Text
						fontWeight={'500'}
						fontSize={'2xl'}
					>
						{daoName}
					</Text>
					<Box
						display={'inline-flex'}
						alignItems={'center'}
						p={0}
						m={0}
						mt={'10.32px'}
					>
						<Box boxSize={5}>
							{daoNetwork.icon}
						</Box>
						<Text
							ml={1}
							mt={'1.5px'}
							fontWeight={'700'}
							fontSize={'sm'}
							color={'brandSubtext'}
						>
							{daoNetwork.label}
						</Text>
					</Box>
				</Flex>
			</Flex>

			<Flex
				mt={14}
				justifyContent={'center'}
			>
				<Flex
					bg={'#F0F0F7'}
					borderRadius={'base'}
					px={3}>
					<GasStation
						color={'#89A6FB'}
						boxSize={5} />
					<Text
						ml={2}
						mt={'1.5px'}
						fontSize={'xs'}>
          Network Fee $12
					</Text>
				</Flex>
			</Flex>

			<Flex
				mt={4}
				justifyContent={'center'}
			>
				<ContinueButton
					onClick={() => {}}
					disabled={transactionFeesIsLoading}
					props={
						{
							minW: '343px',
							variant: 'primaryLightV2'
						}
					}
					content={
						<>
            Create Dao
						</>
					}
				/>
			</Flex>
		</>
	)
}

export default CreateDaoFinal