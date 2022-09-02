import { errorCodes, getMessageFromCode } from 'eth-rpc-errors'
import { RpcError } from 'wagmi'

const TRANSACTION_UNDERPRICED_MSG = `
Oh, no, it appears that the transaction did not have enough gas to go through 😭
<br/>

Please try increasing the gas price and limit by 40% (by clicking the edit button on Metamask) and re-execute the transaction. Read more about it
<a target='_blank' class='chakra-link' href='https://metamask.zendesk.com/hc/en-us/articles/360022895972-How-to-enable-Advanced-Gas-controls'>
  <u>here</u>
</a>
`

const TRANSACTION_REPLACED_MSG = `
The transaction was unexpectedly dropped by the blockchain! 😢 <br />
Please try again 
`

function getErrorMessage(e: RpcError<{ message?: string }> | Error | { error: RpcError<{ message?: string }> }) {
	if('error' in e) {
		e = e.error
	}

	let message: string

	if('code' in e) {
		if(e.code === errorCodes.rpc.internal) {
			if(e?.data?.message) {
				message = e?.data?.message
			} else {
				message = e?.message
			}

			if(message.includes('transaction underpriced')) {
				message = TRANSACTION_UNDERPRICED_MSG
			} else if(e.message.includes('transaction was replaced')) {
				message = TRANSACTION_REPLACED_MSG
			}
		} else {
			message = getMessageFromCode(e?.code, e?.message)
		}
	} else {
		message = e.message
	}

	return message
}

export default getErrorMessage
