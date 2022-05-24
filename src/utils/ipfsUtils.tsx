import config from 'src/constants/config';

const IPFS_UPLOAD_ENDPOINT = 'https://api.thegraph.com/ipfs/api/v0/add?pin=true';
const IPFS_DOWNLOAD_ENDPOINT = 'https://api.thegraph.com/ipfs/api/v0/cat';

export const uploadToIPFS = async (data: string | Blob): Promise<{ hash: string }> => {
  if (data === null) return { hash: config.deafultDAOImageHash };
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

export const getFromIPFS = async (hash: string): Promise<string> => {
  const urls = [
    `${IPFS_DOWNLOAD_ENDPOINT}?arg=${hash}`,
    `https://ipfs.io/ipfs/${hash}`,
  ];

  for (const url of urls) {
    try {
      const fetchResult = await fetch(`${IPFS_DOWNLOAD_ENDPOINT}?arg=${hash}`);
      const responseBody = await fetchResult.text();
      return responseBody;
    } catch (e) {
      console.log(e);
    }
  }

  return '';
};

export const getUrlForIPFSHash = (hash: string) => {
  // https://docs.ipfs.io/concepts/what-is-ipfs
  // https://infura.io/docs/ipfs#section/Getting-Started/Pin-a-file
  if (hash === '') return '';

  // api.thegraph is having problem returning svg files, will fix later
  // this shoudln't affect in the near future as uploading svg files is not supported
  if (hash === config.deafultDAOImageHash) {
    return `https://ipfs.io/ipfs/${hash}`;
  }
  return `${IPFS_DOWNLOAD_ENDPOINT}?arg=${hash}`;
};
