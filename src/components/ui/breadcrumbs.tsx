import React from 'react'
import {
	Box, Link, Text, useTheme,
} from '@chakra-ui/react'

interface BreadcrumbProps {
  path: string[];
  // eslint-disable-next-line react/require-default-props
  id?: string;
}

function Breadcrumbs({ path, id }: BreadcrumbProps) {
	const theme = useTheme()
	return (
		<Text
			mt={5}
			fontWeight="400"
			fontSize="16px"
			lineHeight="24px"
			color="#122224"
			ml="-56px"
		>
			{
				path.map((node, index) => {
					if(index === path.length - 1) {
						return
					}

					// eslint-disable-next-line consistent-return
					return (
						<Box
							key={`breadcrumb-${node}`}
							as="span">
							<Link
								href={
									`/${
										// eslint-disable-next-line no-nested-ternary
										node === 'My Grants'
											? 'your_grants'
										// eslint-disable-next-line no-nested-ternary
											: node === 'Your Grants'
												? 'your_grants'
												// eslint-disable-next-line no-nested-ternary
												: node === 'Grants & Bounties'
													? 'your_grants'
												// eslint-disable-next-line no-nested-ternary
													: node === 'My Applications'
														? 'your_applications'
													// eslint-disable-next-line no-nested-ternary
														: node === 'View Applicants'
															? `your_grants/view_applicants/?grantId=${id}`
														// eslint-disable-next-line no-nested-ternary
															: node === 'View Application'
																? `your_grants/view_applicants/applicant_form/?applicationId=${id}`
															// eslint-disable-next-line no-nested-ternary
																: node === 'Explore Grants'
																	? ''
																	: null
									}`
								}
							>
								{node}
							</Link>
							{' '}
            /
							{' '}
						</Box>
					)
				})
			}
			<Box
				as="span"
				display="inline-block"
				color={theme.colors.brand[500]}
				fontWeight="bold"
			>
				{path[path.length - 1]}
			</Box>
		</Text>
	)
}

export default Breadcrumbs
