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
  ){
    id
    ownerId
    logoIpfsHash
    title
  }
}
`;

export { tokensQuery, getWorkspacesQuery };
