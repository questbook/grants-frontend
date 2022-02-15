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
  numberOfApplications,
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
query($first: Int, $skip: Int, $applicantID: Bytes!) {
  grantApplications(
    first: $first, 
    skip: $skip, 
    where:{
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
query($first: Int, $skip: Int, $grantID: Bytes!) {
  grantApplications(
    first: $first,
    where:{
    grant: $grantID
  },
  subgraphError:allow) {
    id
    grant {
      title
      funding
      reward {
        asset
      }
    }
    applicantId
    state
    createdAtS
    fields {
      id
      value
    }
  }
}
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
    feedback
    createdAtS
  }
}
`;

const getApplicationMilestones = `
query($grantId: ID!) {
	grantApplications(where: { id: $grantId }) {
	  grant {
      reward {
        asset
      }
    },
	  milestones {
		id,
		state,
		title,
		amount,
		amountPaid,
		updatedAtS,
	  }
	}
}
`;

const getFundSentForApplication = `
query($applicationId: String) {
  fundsTransfers(where: {application: $applicationId}, orderBy: createdAtS, orderDirection: desc) {
    grant {
    	id
    },
    application {
      id
    },
    milestone {
      id,
      title
    },
    id,
    amount,
    sender,
    to,
    createdAtS,
    type
  }
}
`;

const getMembersForAWorkspace = `
`;

export {
  getAllGrants, getNumOfApplicantsForAGrant, getAllDaoGrants as getAllGrantsForADao,
  getGrantDetails, getApplicantsForAGrant, getApplicationDetails,
  getApplicationMilestones, getFundSentForApplication, getMembersForAWorkspace, getGrantApplication,
  getMyApplications, getWorkspaceDetails,
};
