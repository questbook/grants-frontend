function getProposalUrl(realmPk: string, proposalAddr: string) {
	return `https://app.realms.today/dao/${realmPk}/proposal/${proposalAddr}`
}

function getDaoUrl(realmPk: string) {
	return `https://app.realms.today/dao/${realmPk}`
}

export { getProposalUrl, getDaoUrl }