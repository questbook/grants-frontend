import { useContext, useMemo } from 'react'
import { defaultChainId } from 'src/constants/chains'
import useFunctionCall from 'src/libraries/hooks/useFunctionCall'
import logger from 'src/libraries/logger'
import { getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'
import { validateAndUploadToIpfs } from 'src/libraries/validator'
import { GrantsProgramContext } from 'src/pages/_app'
import { ReviewType } from 'src/types'
import { RubricItem } from 'src/types/gen'

interface Props {
	setNetworkTransactionModalStep: (step: number | undefined) => void
	setTransactionHash: (hash: string) => void
}

function useSetRubrics({ setNetworkTransactionModalStep, setTransactionHash }: Props) {
	const { grant } = useContext(GrantsProgramContext)!

	const chainId = useMemo(() => {
		return getSupportedChainIdFromWorkspace(grant?.workspace) ?? defaultChainId
	}, [grant])

	const { call, isBiconomyInitialised } = useFunctionCall({ chainId, contractName: 'reviews', setTransactionStep: setNetworkTransactionModalStep, setTransactionHash })

	const setRubrics =
		async(reviewType: ReviewType, isPrivate: boolean, items: RubricItem[]) => {
			if(!grant) {
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
				args: [grant.workspace.id, grant.id, hash]
			})
		}

	return {
		setRubrics, isBiconomyInitialised
	}
}

export default useSetRubrics
