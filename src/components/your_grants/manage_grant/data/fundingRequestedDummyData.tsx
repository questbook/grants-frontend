const data = new Array(10);
data.fill({
  funding_received: {
    milestone: { number: 1, title: 'Milestone 1' },
    fund: {
      amount: 1,
      symbol: 'ETH',
      icon: '/images/dummy/Ethereum Icon.svg',
    },
  },
  on: { timestamp: new Date('January 24, 2022 23:59:59:000').getTime() },
  from: { address: '0x1a...' },
  status: { state: 'done', txnHash: '' },
}, 0, 5);
data.fill({
  funding_received: {
    milestone: { number: 1, title: 'Milestone 1' },
    fund: {
      amount: 1,
      symbol: 'ETH',
      icon: '/images/dummy/Ethereum Icon.svg',
    },
  },
  on: { timestamp: new Date('January 24, 2022 23:59:59:000').getTime() },
  from: { address: '0x1a...' },
  status: { state: 'processing', txnHash: '' },
}, 5, 10);

// const dataShuffled = data.sort(() => Math.random() - 0.5);
export default data;
