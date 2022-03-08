import { errorCodes, getMessageFromCode } from 'eth-rpc-errors';

function getErrorMessage(e: any) {
  // eslint-disable-next-line no-param-reassign
  if (e.error) e = e.error;
  console.log('Error: ', e);
  let message = '';
  if (e.code === errorCodes.rpc.internal) {
    console.log('Internal error: ', e.data.message);
    if (e.data.message) message = e.data.message;
    else message = e.message;
  } else message = getMessageFromCode(e.code, e.message);
  console.log('Message: ', message);
  return message;
}

export default getErrorMessage;
