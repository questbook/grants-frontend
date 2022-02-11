const getAllGrants = `
query($first: Int, $skip: Int) {
  grants(
    first: $first, 
    skip: $skip, 
    subgraphError: allow, 
    where: {acceptingApplications: true},
    orderBy: createdAtS, 
    orderDirection: desc
  ) {
  id, 
  creatorId, 
  title, 
  summary, 
  details, 
  reward {
    committed,
    id,
    asset
  }, 
  workspace {title, logoIpfsHash}, 
  deadline,
  funding,
}}
`;

const getNumOfApplicantsForAGrant = `
`;

const getAllDaoGrants = `
query($first: Int, $skip: Int, $creatorId: Bytes!) {
  grants(
    first: $first, 
    skip: $skip, 
    subgraphError: allow, 
    where: {
      acceptingApplications: true, 
      creatorId: $creatorId
    }
    orderBy: createdAtS, 
    orderDirection: desc
  ) {
  id, 
  creatorId, 
  title, 
  summary, 
  details, 
  reward {
    committed,
    id,
    asset
  }, 
  workspace {title, logoIpfsHash}, 
  deadline,
  funding,
}}
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
  getAllGrants, getNumOfApplicantsForAGrant, getAllDaoGrants as getAllGrantsForADao,
  getGrantDetails, getApplicantsForAGrant, getApplicationDetails,
  getApplicationMilestones, getFundSentForApplication, getMembersForAWorkspace,

};
