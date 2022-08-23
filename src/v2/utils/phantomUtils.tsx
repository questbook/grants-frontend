export default function getProposalUrl(realmPk: string, proposalAddr: string) {
	return `https://app.realms.today/dao/${realmPk}/proposal/${proposalAddr}`
}