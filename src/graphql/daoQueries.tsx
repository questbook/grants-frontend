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

const getAllGrantsForADao = `
query($first: Int, $skip: Int, $creatorId: Bytes!) {
    grants(first: $first, skip: $skip, subgraphError: allow, where: {acceptingApplications: true, creatorId: $creatorId}) {
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

const getGrantDetails = `
query($grantID: ID!) {
    grants(where: {id: $grantID}, subgraphError: allow){
        id, 
        creatorId, 
        title, 
        summary, 
        details, 
        fields (first: 10) {id, title, inputType}
        reward {id, asset, committed}, 
        workspace {title, logoIpfsHash}, 
        deadline,
        funding,
    }
}
`;

const getApplicantsForAGrant = `

`;

const getApplicationDetails = `
`;

const getApplicationMilestones = `
`;

const getFundSentForApplication = `
`;

const getMembersForAWorkspace = `
`;

export {
  getAllGrants,
  getNumOfApplicantsForAGrant,
  getAllGrantsForADao,
  getGrantDetails,
  getApplicantsForAGrant,
  getApplicationDetails,
  getApplicationMilestones,
  getFundSentForApplication,
  getMembersForAWorkspace,
};
