import { useContext, useEffect, useState } from 'react'
import { ApiClientsContext } from 'pages/_app'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'


export default function useMailTo(
	to : string | undefined = undefined,
	body: string | undefined = undefined,
	subject: string | undefined = undefined,
	cc: string | undefined = undefined,
	bcc: string | undefined = undefined,
) {
	const apiClients = useContext(ApiClientsContext)!
	const { workspace } = apiClients
	const { data: accountData, nonce } = useQuestbookAccount()
	const [email, setEmail] = useState<string | null>()

	useEffect(() => {
		const managerEmail = workspace?.members.find(
			(member) => member.actorId.toLowerCase() === accountData?.address?.toLowerCase(),
		)?.email
		setEmail(managerEmail)
	}, [workspace, accountData])

	const [defaultLink, setDefaultLink] = useState<string>()

	const yahooLink = `https://compose.mail.yahoo.com/?to=${to}${cc ? `&cc=${cc}` : ''}${bcc ? `&bcc=${bcc}` : ''}${subject ? `&su=${subject}` : ''}${body ? `&body=${body}` : ''}`
	const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}${cc ? `&cc=${cc}` : ''}${bcc ? `&bcc=${bcc}` : ''}${subject ? `&su=${subject}` : ''}${body ? `&body=${body}` : ''}`

	useEffect(() => {
		if(email?.includes('@gmail')) {
			setDefaultLink(gmailLink)
		} else if(email?.includes('@yahoo')) {
			setDefaultLink(yahooLink)
		} else {
			setDefaultLink(undefined)
		}
	}, [email, gmailLink, yahooLink])

	return { defaultLink, gmailLink, yahooLink }
}
