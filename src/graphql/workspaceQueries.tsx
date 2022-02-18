const tokensQuery = `
query($first: Int, $orderBy: BigInt, $orderDirection: String) {
  tokens(
    first: $first, orderBy: $orderBy, orderDirection: $orderDirection
  ) {
    id
    tokenID
    contentURI
    metadataURI
  }
}
`;

const getWorkspacesQuery = `
query($ownerId: Bytes!) {
  workspaces(
    where: {
      ownerId: $ownerId
    }
    subgraphError: allow
    orderBy: createdAtS
    orderDirection: desc
  ){
    id
    ownerId
    logoIpfsHash
    title
  }
}
`;
const getWorkspaceMembersQuery = `
query($actorId: Bytes!) {
  workspaceMembers(
    where: {
      actorId: $actorId
    }
    subgraphError: allow
    orderBy: id
    orderDirection: desc
  ){
    id
    actorId
    workspace {
      id
      ownerId
      logoIpfsHash
      title
    }
  }
}
`;

export { tokensQuery, getWorkspacesQuery, getWorkspaceMembersQuery };
