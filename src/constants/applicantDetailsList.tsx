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
	},
	{
		title: 'Wallet Address',
		id: 'applicantAddress',
		inputType: 'short-form',
		isRequired: true
	},
	{
		title: 'Team',
		id: 'teamMembers',
		inputType: 'long-form',
		isRequired: false,
	},
	{
		title: 'Usage of Grant',
		tooltip: 'Details on how the grant will be used to achieve the proposal goals',
		id: 'fundingBreakdown',
		inputType: 'long-form',
		isRequired: false,
	},
	{
		title: 'Project Name',
		id: 'projectName',
		inputType: 'short-form',
		isRequired: true,
	},
	{
		title: 'Project Links',
		id: 'projectLink',
		inputType: 'array',
		isRequired: false,
	},
	{
		title: 'Project Details',
		id: 'projectDetails',
		inputType: 'long-form',
		isRequired: true,
	},
	{
		title: 'Project Goals',
		id: 'projectGoals',
		inputType: 'long-form',
		isRequired: false,
	},
	{
		title: 'Milestones',
		id: 'isMultipleMilestones',
		inputType: 'array',
		isRequired: false,
	},
	{
		title: 'Add more questions',
		id: 'customFields',
		inputType: 'array',
		isRequired: false,
	},
	// {
	//   title: 'Add Custom Field',
	//   id: 'extraField',
	//   inputType: 'short-form',
	//   isRequired: false,
	// },
	{
		title: 'Funding Ask',
		id: 'fundingAsk',
		inputType: 'long-form',
		isRequired: true,
	},
	{
		title: 'Member Details',
		id: 'memberDetails',
		inputType: 'long-form',
		isRequired: true,
	},
]
