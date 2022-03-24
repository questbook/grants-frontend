import { ethers } from 'ethers';
import React from 'react';
import moment from 'moment';
import { FundTransfer } from 'src/types';
import applicantDetailsList from 'src/constants/applicantDetailsList';
import { ALL_SUPPORTED_CHAIN_IDS } from 'src/constants/chains';
import { CHAIN_INFO } from 'src/constants/chainInfo';

export function timeToString(
  timestamp: number,
  type?: 'day_first' | 'month_first',
  show_year?: boolean,
) {
  const date = new Date(timestamp);
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return type === 'day_first'
    ? `${date.getUTCDate().toString()} ${months[date.getMonth()].substring(
      0,
      3,
    )}, ${date.getFullYear()}`
    : `${months[date.getMonth()]} ${date.getUTCDate().toString()} ${
      show_year ? date.getFullYear() : ''
    }`;
}
export function parseAmount(number: string, contractAddress?: string) {
  let decimals = 18;
  console.log('nnnunun');
  console.log(number);

  if (contractAddress) {
    let allCurrencies: any[] = [];
    ALL_SUPPORTED_CHAIN_IDS.forEach((id) => {
      const { supportedCurrencies } = CHAIN_INFO[id];
      const supportedCurrenciesArray = Object.keys(supportedCurrencies).map(
        (i) => supportedCurrencies[i],
      );
      allCurrencies = [...allCurrencies, ...supportedCurrenciesArray];
    });

    console.log(allCurrencies);
    console.log(contractAddress);

    decimals = allCurrencies.find((currency) => currency.address === contractAddress)
      ?.decimals || 18;

    console.log(decimals);
    return ethers.utils.parseUnits(number, decimals).toString();
  }

  // console.log('number', number);
  return ethers.utils.parseUnits(number, 18).toString();
}

function nFormatter(value: string, digits = 3) {
  const num = Math.abs(Number(value));
  if (num < 10000) {
    return value;
  }
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find((i) => num >= i.value);
  return item
    ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol
    : '0';
}

function truncateTo(number: string, digits = 3) {
  // console.log('Number to truncate: ', number);
  const decimalIndex = number.indexOf('.');
  // console.log('Decimal index: ', decimalIndex, ', digits: ', digits);
  if (decimalIndex === -1) return number;
  let ret = number.substring(0, decimalIndex + 1);
  // console.log('String to return initialised: ', ret);
  const lastSymbol = number.charCodeAt(number.length - 1);
  // console.log('Last symbol: ', lastSymbol);
  const containsSymbol = !(lastSymbol >= 48 && lastSymbol <= 57);
  // console.log('Contains symbol: ', containsSymbol);
  let isEntirelyZeroAfterDecimal = true;
  // console.log(
  //   'a: ',
  //   decimalIndex + digits,
  //   'b: ',
  //   containsSymbol ? number.length - 1 : number.length,
  //   ', Will loop till: ',
  //   Math.min(
  //     decimalIndex + digits,
  //     containsSymbol ? number.length - 1 : number.length
  //   )
  // );
  for (
    let i = decimalIndex + 1;
    i
    < Math.min(
      decimalIndex + digits + 1,
      containsSymbol ? number.length - 1 : number.length,
    );
    i += 1
  ) {
    // console.log(
    //   'i: ',
    //   i,
    //   ', entirely zero: ',
    //   isEntirelyZeroAfterDecimal,
    //   ', charCode: ',
    //   number.charCodeAt(i),
    //   ', ret: ',
    //   ret,
    // );
    isEntirelyZeroAfterDecimal &&= number.charCodeAt(i) === 48;
    ret += number.charAt(i);
  }
  // console.log('Entirely zero: ', isEntirelyZeroAfterDecimal, ', ret: ', ret);
  const returnValue = (isEntirelyZeroAfterDecimal ? ret.substring(0, decimalIndex) : ret)
    + (containsSymbol ? number.charAt(number.length - 1) : '');
  // console.log('Return value: ', returnValue);
  return returnValue;
}

export function formatAmount(number: string, decimals = 18) {
  const value = ethers.utils.formatUnits(number, decimals).toString();
  const formattedValue = nFormatter(value);
  return truncateTo(formattedValue);
  // return formattedValue;
}

export function highlightWordsInString(
  string: string,
  words: string[],
  color: string,
) {
  const regex = new RegExp(`(${words.join('|')})`, 'gi');
  const formatted = string.replace(regex, (match) => `<span>${match}<span>`);
  return formatted.split('<span>').map((word, index) => {
    if (index % 2) {
      return <span style={{ color, fontWeight: '700' }}>{word}</span>;
    }
    return word;
  });
}

export function getIconFromCurrency(
  currency: string,
  isCircled: boolean = false,
) {
  switch (currency) {
    case 'DAI':
      return isCircled
        ? '/ui_icons/brand/currency/dai.svg'
        : '/ui_icons/brand/currency/dai_symbol.svg';
    case 'WMATIC':
      return isCircled
        ? '/ui_icons/brand/currency/wmatic.svg'
        : '/ui_icons/brand/currency/wmatic_symbol.svg';
    case 'WETH':
      return isCircled
        ? '/ui_icons/brand/currency/weth.svg'
        : '/ui_icons/brand/currency/weth_symbol.svg';
    default:
      return '/images/dummy/Ethereum Icon.svg';
  }
}

export function getFormattedDate(timestamp: number) {
  const date = new Date(timestamp);
  return moment(date).format('LL');
}

export function getFormattedDateFromUnixTimestamp(timestamp: number) {
  return moment.unix(timestamp).format('DD MMM');
}

export function getFormattedDateFromUnixTimestampWithYear(
  timestamp: number | undefined,
) {
  return timestamp ? moment.unix(timestamp).format('MMM DD, YYYY') : undefined;
}

export function getFormattedFullDateFromUnixTimestamp(timestamp: number) {
  return moment.unix(timestamp).format('LL');
}

export function truncateStringFromMiddle(str: string) {
  if (!str) return '';
  if (str.length > 10) {
    return `${str.substring(0, 4)}...${str.substring(
      str.length - 4,
      str.length,
    )}`;
  }
  return str;
}

// extract milstone index from ID and generate title like "Milestone (index+1)"
export function getMilestoneMetadata(milestone: FundTransfer['milestone']) {
  if (milestone) {
    const [applicationId, idx] = milestone.id.split('.');
    return {
      applicationId,
      milestoneIndex: +idx,
    };
  }
  return undefined;
}

// extract milstone index from ID and generate title like "Milestone (index+1)"
export function getMilestoneTitle(milestone: FundTransfer['milestone']) {
  const item = getMilestoneMetadata(milestone);
  if (typeof item !== 'undefined') {
    return `Milestone ${item.milestoneIndex + 1}`;
  }
  return 'Unknown Milestone';
}

export const getTextWithEllipses = (txt: string, maxLength = 7) => (txt.length > maxLength ? `${txt.slice(0, maxLength)}...` : txt);

export const getChainIdFromResponse = (networkString: string): string => networkString?.split('_')[1];

// eslint-disable-next-line max-len
export const getFieldLabelFromFieldTitle = (title: string) => applicantDetailsList.find((detail) => detail.id === title)?.title;
