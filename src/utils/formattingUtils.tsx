import { ethers } from 'ethers';
import React from 'react';

export function timeToString(timestamp: number, type?: 'day_first' | 'month_first', show_year?: boolean) {
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
  return (type === 'day_first')
    ? (`${date.getUTCDate().toString()} ${months[date.getMonth()].substring(0, 3)}, ${date.getFullYear()}`)
    : (`${months[date.getMonth()]} ${date.getUTCDate().toString()} ${show_year ? date.getFullYear() : ''}`);
}

export function parseAmount(number: string) {
  return ethers.utils.parseUnits(number, 18).toString();
}

export function highlightWordsInString(string: string, words: string[], color: string) {
  const regex = new RegExp(`(${words.join('|')})`, 'gi');
  const formatted = string.replace(
    regex,
    (match) => `<span>${match}<span>`,
  );
  return formatted.split('<span>').map((word, index) => {
    if (index % 2) {
      return <span style={{ color, fontWeight: '700' }}>{word}</span>;
    }
    return word;
  });
}
