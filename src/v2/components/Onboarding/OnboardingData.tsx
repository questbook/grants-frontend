import { Image } from '@chakra-ui/react'

export const onboardingData = {
	developer: {
		title: 'Apply for Grants',
		description: 'For builders, developers, and entrepreneurs',
		image: <Image
			w='71.8px'
			h='56px'
			src='/apply-for-grants.svg' />,
		data: [{
			title: 'Browse grant programs',
			image: <Image
				mt={7}
				w='71.8px'
				h='56px'
				src='/apply-for-grants.svg' />,
		}, {
			title: 'Pitch your ideas, & raise funds',
			image: <Image
				mt={7}
				w='71.8px'
				h='56px'
				src='/apply-for-grants.svg' />,
		}, {
			title: 'Earn your web3 credentials',
			image: <Image
				mt={7}
				w='71.8px'
				h='56px'
				src='/apply-for-grants.svg' />,
		}],

	},
	dao: {
		title: 'Run Grants program',
		description: 'For DAOs, protocols, and funds',
		image: <Image
			w='40.67px'
			h='56px'
			src='/run-grants.svg' />,
		data: [{
			title: 'Create a grant program',
			image: <Image
				mt={7}
				w='71.8px'
				h='56px'
				src='/apply-for-grants.svg' />,
		}, {
			title: 'Review applications',
			image: <Image
				mt={7}
				w='71.8px'
				h='56px'
				src='/apply-for-grants.svg' />,
		}, {
			title: 'Track milestones and disburse funds',
			image: <Image
				mt={7}
				w='71.8px'
				h='56px'
				src='/apply-for-grants.svg' />,
		}],
	}
}