import { ethers } from 'ethers';
import React from 'react';

export function parseAmount(number: string) {
  return ethers.utils.parseUnits(number, 18).toString();
}

export function formatAmount(number: string) {
  return ethers.utils.formatUnits(number, 18).toString();
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
