import { ethers } from 'ethers';

const isValidAddress = (address: string) => ethers.utils.isAddress(address);
const isValidEmail = (email: string) => {
  const regexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regexp.test(email);
};

export { isValidAddress, isValidEmail };
