export default [
	{
		title: 'Name',
		id: 'applicantName',
		inputType: 'short-form',
		isRequired: true,
	},
	{
		title: 'Email',
		id: 'applicantEmail',
		inputType: 'short-form',
		isRequired: true,
		pii: true
	},
	{
		title: 'Telegram',
		id: 'applicantTelegram',
		inputType: 'short-form',
		isRequired: false,
	},
	{
		title: 'Wallet Address',
		id: 'applicantAddress',
		inputType: 'short-form',
		isRequired: true
	},
	{
		title: 'Team Members',
		id: 'teamMembers',
		inputType: 'long-form',
		isRequired: false,
	},

	{
		title: 'Title',
		id: 'projectName',
		inputType: 'short-form',
		isRequired: true,
	},
	{
		title: 'Project Details',
		id: 'projectDetails',
		inputType: 'long-form',
		isRequired: true,
	},
	{
		title: 'Funding Ask',
		id: 'fundingAsk',
		inputType: 'long-form',
		isRequired: true,
	},
	{
		title: 'tl,dr',
		id: 'tldr',
		inputType: 'short-form',
		isRequired: false,
	}
]
