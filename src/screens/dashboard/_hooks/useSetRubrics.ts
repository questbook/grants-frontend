import { useCallback, useContext, useMemo } from 'react'
import useQBContract from 'src/hooks/contracts/useQBContract'
import useFunctionCall from 'src/libraries/hooks/useFunctionCall'
import logger from 'src/libraries/logger'
import { validateAndUploadToIpfs } from 'src/libraries/validator'
import { ApiClientsContext } from 'src/pages/_app'
import { DashboardContext } from 'src/screens/dashboard/Context'
import { ReviewType } from 'src/types'
import { RubricItem } from 'src/types/gen'

interface Props {
	setNetworkTransactionModalStep: (step: number | undefined) => void
	setTransactionHash: (hash: string) => void
}

function useSetRubrics({ setNetworkTransactionModalStep, setTransactionHash }: Props) {
	const { workspace, chainId } = useContext(ApiClientsContext)!
	const { selectedGrant } = useContext(DashboardContext)!

	const applicationReviewRegistry = useQBContract('reviews', chainId)

	const { call } = useFunctionCall({ chainId, contractName: 'reviews', setTransactionStep: setNetworkTransactionModalStep, setTransactionHash })

	const setRubrics = useCallback(
		async(reviewType: ReviewType, isPrivate: boolean, items: RubricItem[]) => {
			if(!selectedGrant || !workspace) {
				return
			}

			logger.info(reviewType, 'RubricSetRequest reviewType')
			logger.info(isPrivate, 'RubricSetRequest isPrivate')
			logger.info(items, 'RubricSetRequest items')

			const rubric: {[_ in string]: {
				title: string
				details: string
				maximumPoints: number
			}} = {}

			if(reviewType === ReviewType.Rubrics) {
				for(let i = 0; i < items.length; i++) {
					rubric[i] = {
						title: items[i].title,
						details: items[i].details ?? '',
						maximumPoints: items[i].maximumPoints,
					}
				}
			} else if(reviewType === ReviewType.Voting) {
				rubric[0] = {
					title: 'Vote for',
					details: '',
					maximumPoints: 1,
				}
			} else {
				return
			}

			logger.info(rubric, 'RubricSetRequest')

			const rubricJson = {
				reviewType: reviewType === ReviewType.Rubrics ? 'rubrics' : 'voting',
				rubric: {
					isPrivate,
					rubric,
				},
			}

			logger.info(rubricJson, 'RubricSetRequest json')

			const { hash } = await validateAndUploadToIpfs('RubricSetRequest', rubricJson)

			logger.info(hash, 'RubricSetRequest hash')

			await call({
				method: 'setRubrics',
				args: [workspace.id, selectedGrant.id, selectedGrant.numberOfReviewersPerApplication ?? 0, hash]
			})
		},
		[applicationReviewRegistry, selectedGrant, workspace],
	)

	return {
		setRubrics: useMemo(
			() => setRubrics,
			[applicationReviewRegistry, selectedGrant, workspace],
		),
	}
}

export default useSetRubrics
