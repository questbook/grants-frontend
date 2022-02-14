const getWorkspaceDetails = `
query($workspaceID: ID!) {
    workspace(id: $workspaceID, subgraphError: allow) {
        id
        title
        about
        logoIpfsHash
        coverImageIpfsHash
        supportedNetworks
        socials {
          name
          value
        }
    }
}
`;

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
        fields (first: 20) {id, title, inputType}
        reward {id, asset, committed}, 
        workspace {id, title, logoIpfsHash}, 
        deadline,
        funding,
    }
}
`;

const getGrantApplication = `
query($grantID: ID!, $applicantID: Bytes!) {
  grantApplications(where:{
    applicantId: $applicantID,
    grant :  $grantID
  },
  subgraphError:allow) {
    id
    grant {
      id
      title
    }
    applicantId
  }
}
`;

const getMyApplications = `
query($applicantID: Bytes!) {
  grantApplications(where:{
    applicantId: $applicantID
  },
  subgraphError:allow) {
    id
    grant {
      id
      title
      funding
      workspace {
        id
        title
        logoIpfsHash
      }
    }
    applicantId
    state
    createdAtS
  }
}
`;

const getApplicantsForAGrant = `

`;

const getApplicationDetails = `
query($applicationID: Bytes!) {
  grantApplication(
    id: $applicationID,
  subgraphError:allow) {
    id
    fields {
      id
      value
    }
    milestones {
      id
      title
      amount
    }
    grant {
      id
      title
      funding
      workspace {
        id
        title
        logoIpfsHash
      }
      reward {
        id
        asset
        committed
      }
    }
    applicantId
    state
    createdAtS
  }
}
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
  getApplicationMilestones, getFundSentForApplication, getMembersForAWorkspace, getGrantApplication,
  getMyApplications, getWorkspaceDetails,
};
