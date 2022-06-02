const data = new Array(15)
data.fill({
	milestone: {
		title: 'Feature complete and deployed onto testnet',
		subtitle: 'Milestone 1',
	},
	reward: {
		received: 0,
		total: 10,
		symbol: 'ETH',
		icon: '/images/dummy/Ethereum Icon.svg',
	},
	status: {
		state: 'submitted',
		txnHash: '',
	},
}, 0, 5)
data.fill({
	milestone: {
		title: 'Feature complete and deployed onto testnet',
		subtitle: 'Milestone 2',
	},
	reward: {
		received: 0,
		total: 10,
		symbol: 'ETH',
		icon: '/images/dummy/Ethereum Icon.svg',
	},
	status: {
		state: 'done',
		txnHash: '',
		done_date: { timestamp: new Date('January 24, 2022 23:59:59:000').getTime() },
	},
}, 5, 10)
data.fill({
	milestone: {
		title: 'Feature complete and deployed onto testnet',
		subtitle: 'Milestone 3',
	},
	reward: {
		received: 0,
		total: 10,
		symbol: 'ETH',
		icon: '/images/dummy/Ethereum Icon.svg',
	},
	status: {
		state: 'approved',
		txnHash: '',
		approved_date: { timestamp: new Date('January 28, 2022 23:59:59:000').getTime() },
	},
}, 10, 15)
// const dataShuffled = data.sort(() => Math.random() - 0.5);

export default data
