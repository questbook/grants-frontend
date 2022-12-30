import { useCallback, useContext, useMemo } from 'react'
import useQBContract from 'src/hooks/contracts/useQBContract'
import useFunctionCall from 'src/libraries/hooks/useFunctionCall'
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

	const { call } = useFunctionCall({ chainId, contractName: 'reviews' })

	const setRubrics = useCallback(
		async(reviewType: ReviewType, isPrivate: boolean, items: RubricItem[]) => {
			if(!selectedGrant || !workspace) {
				return
			}

			const rubric: {[_ in string]: {
				title: string
				details: string
				maximumPoints: number
			}} = {}

			for(let i = 0; i < items.length; i++) {
				rubric[i] = {
					title: items[i].title,
					details: '',
					maximumPoints: 5,
				}
			}

			const rubricJson = {
				reviewType: reviewType === ReviewType.Rubrics ? 'rubrics' : 'voting',
				rubric: {
					isPrivate,
					rubric,
				},
			}

			const { hash } = await validateAndUploadToIpfs('RubricSetRequest', rubricJson)

			await call({
				method: 'setRubrics',
				args: [workspace.id, selectedGrant.id, selectedGrant.numberOfReviewersPerApplication ?? 0, hash]
			})
		},
		[applicationReviewRegistry, selectedGrant],
	)

	return {
		assignReviewers: useMemo(
			() => setRubrics,
			[applicationReviewRegistry, selectedGrant],
		),
	}
}

export default useSetRubrics
