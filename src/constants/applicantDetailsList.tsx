export default [
  {
    title: 'Applicant Name',
    id: 'applicantName',
    inputType: 'short-form',
    isRequired: true,
  },
  {
    title: 'Applicant Email',
    id: 'applicantEmail',
    inputType: 'short-form',
    isRequired: true,
  },
  {
    title: 'Team Members',
    id: 'teamMembers',
    inputType: 'long-form',
    isRequired: false,
  },
  {
    title: 'Funding Breakdown',
    tooltip: 'Funding breakdown for each team member',
    id: 'fundingBreakdown',
    inputType: 'long-form',
    isRequired: true,
  },
  {
    title: 'Project Name',
    id: 'projectName',
    inputType: 'short-form',
    isRequired: true,
  },
  {
    title: 'Project Link',
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
    title: 'Other Information',
    id: 'extraField',
    inputType: 'short-form',
    isRequired: false,
  },
  {
    title: 'Funding Ask',
    id: 'fundingAsk',
    inputType: 'long-form',
    isRequired: true,
  },
];
