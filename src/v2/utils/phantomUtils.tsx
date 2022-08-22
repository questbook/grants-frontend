export default function getProposalUrl(realmPk: string, proposalAddr: string) {
	return `http://localhost:3002/dao/${realmPk}/proposal/${proposalAddr}`
}