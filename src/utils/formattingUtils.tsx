import { ethers } from 'ethers';
import React from 'react';
import moment from 'moment';
import { FundTransfer } from 'src/types';

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
export function parseAmount(number: string) {
  // console.log('number', number);
  return ethers.utils.parseUnits(number, 18).toString();
}

function nFormatter(value: string, digits = 2) {
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
  const item = lookup.slice().reverse().find((i) => num >= i.value);
  return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0';
}

export function formatAmount(number: string) {
  const value = ethers.utils.formatUnits(number, 18).toString();
  return nFormatter(value);
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

export function getIconFromCurrency(currency: string, isCircled: boolean = false) {
  switch (currency) {
    case 'DAI': return isCircled ? '/ui_icons/brand/currency/dai.svg' : '/ui_icons/brand/currency/dai_symbol.svg';
    case 'WMATIC': return isCircled ? '/ui_icons/brand/currency/wmatic.svg' : '/ui_icons/brand/currency/wmatic_symbol.svg';
    case 'WETH': return isCircled ? '/ui_icons/brand/currency/weth.svg' : '/ui_icons/brand/currency/weth_symbol.svg';
    default: return '/images/dummy/Ethereum Icon.svg';
  }
}

export function getFormattedDate(timestamp: number) {
  const date = new Date(timestamp);
  return moment(date).format('LL');
}

export function getFormattedDateFromUnixTimestamp(timestamp: number) {
  return moment.unix(timestamp).format('DD MMM');
}

export function getFormattedDateFromUnixTimestampWithYear(timestamp: number | undefined) {
  return timestamp ? moment.unix(timestamp).format('MMM DD, YYYY') : undefined;
}

export function getFormattedFullDateFromUnixTimestamp(timestamp: number) {
  return moment.unix(timestamp).format('LL');
}

export function truncateStringFromMiddle(str:string) {
  if (!str) return '';
  if (str.length > 10) {
    return `${str.substring(0, 4)}...${str.substring(str.length - 4, str.length)}`;
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

export const getChainIdFromResponse = (networkString: string):string => networkString?.split('_')[1];
