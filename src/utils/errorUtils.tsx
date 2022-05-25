import { errorCodes, getMessageFromCode } from 'eth-rpc-errors';

const TRANSACTION_UNDERPRICED_MSG = `
Oh, no, it appears that the transaction did not have enough gas to go through 😭
<br/>

Please try increasing the gas price and limit by 40% (by clicking the edit button on Metamask) and re-execute the transaction. Read more about it
<a target='_blank' className='chakra-link' href='https://metamask.zendesk.com/hc/en-us/articles/360022895972-How-to-enable-Advanced-Gas-controls'>
  <u>here</u>
</a>
`;

const TRANSACTION_REPLACED_MSG = `
The transaction was unexpectedly dropped by the blockchain! 😢 <br />
Please try again 
`;

function getErrorMessage(e: any) {
  // eslint-disable-next-line no-param-reassign
  if (e.error) e = e.error;

  let message = '';
  if (e.code === errorCodes.rpc.internal) {
    if (e?.data?.message) message = e?.data?.message;
    else message = e?.message;

    if (message.includes('transaction underpriced')) {
      message = TRANSACTION_UNDERPRICED_MSG;
    } else if (e.message.includes('transaction was replaced')) {
      message = TRANSACTION_REPLACED_MSG;
    }

    console.log('Internal error: ', e);
  } else {
    console.log('General error: ', e);
    message = getMessageFromCode(e?.code, e?.message);
  }
  console.log('Message: ', message);
  return message;
}

export default getErrorMessage;
