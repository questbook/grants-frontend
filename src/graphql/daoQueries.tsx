const getAllGrants = `
query($first: Int, $skip: Int) {
    grants(first: $first, skip: $skip, subgraphError: allow, where: {acceptingApplications: true}) {
        id, 
        creatorId, 
        title, 
        summary, 
        details, 
        reward {committed}, 
        workspace {title, logoIpfsHash}, 
        deadline,
        funding,
      }
}
`;

const getNumOfApplicantsForAGrant = `

`;

export { getAllGrants, getNumOfApplicantsForAGrant };
