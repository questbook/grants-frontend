const IPFS_UPLOAD_ENDPOINT = 'https://ipfs.infura.io:5001/api/v0/add?pin=true';

export const uploadToIPFS = async (data: string | Blob): Promise<{ hash: string }> => {
  const form = new FormData();
  form.append('file', data);

  // refer to https://infura.io/docs/ipfs#section/Getting-Started/Add-a-file
  const fetchResult = await fetch(IPFS_UPLOAD_ENDPOINT, {
    method: 'POST',
    body: form,
  });
  const responseBody = await fetchResult.json();
  return { hash: responseBody.Hash };
};

export const getUrlForIPFSHash = (hash: string) => (
  // https://docs.ipfs.io/concepts/what-is-ipfs
  // https://infura.io/docs/ipfs#section/Getting-Started/Pin-a-file
  `https://ipfs.infura.io:5001/api/v0/cat?arg=${hash}`
);
