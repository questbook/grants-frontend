const seoConfig = {
	title: 'Questbook',
	titleTemplate: '%s',
	description:
      'Discover Opportunities in Web 3.0 and Earn in Crypto',
	// siteUrl: 'https://www.questbook.app/',
	siteUrl: 'https://beta.questbook.app/',
	twitter: {
		handle: '@questbookapp',
		site: '@questbookapp',
		cardType: 'summary_large_image',
		title: 'Questbook Grant',
		image: 'https://ipfs.questbook.app:8080/ipfs/QmfLZpBP833X4aZLWeoKaycUvAXdXJQWPvAPjLjkfrFKPR',
	},
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: 'https://beta.questbook.app/',
		title: 'Questbook',
		description:
        'Discover Opportunities in Web 3.0 and Earn in Crypto',
		// eslint-disable-next-line camelcase
		site_name: 'Questbook',
		images: [
			{
				url: 'https://ipfs.questbook.app:8080/ipfs/QmfLZpBP833X4aZLWeoKaycUvAXdXJQWPvAPjLjkfrFKPR',
				width: 1240,
				height: 480,
				alt: 'Questbook Grant',
			},
			{
				url: 'https://ipfs.questbook.app:8080/ipfs/QmfLZpBP833X4aZLWeoKaycUvAXdXJQWPvAPjLjkfrFKPR',
				width: 1012,
				height: 506,
				alt: 'Questbook Grant',
			},
		],
	},
}

export default seoConfig