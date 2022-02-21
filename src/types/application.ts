export interface GrantApplicationProps {
  applicantName: string;
  applicantEmail:string;
  teamMembers: number;
  membersDescription: { description: string }[];
  projectName: string;
  projectLinks: { link: string }[];
  projectDetails: string;
  projectGoal: string;
  projectMilestones: { milestone: string, milestoneReward: string }[];
  fundingAsk: string;
  fundingBreakdown: string;

}

export interface GrantApplicationFieldsSubgraph {
  applicantName: string[];
  applicantEmail:string[];
  projectName: string[];
  projectDetails: string[];
  fundingAsk: string[];
  fundingBreakdown: string[];
  teamMembers?: string[];
  memberDetails?: string[];
  projectLink?: string[];
  projectGoals?: string[];
  isMultipleMilestones?: string[];
}

interface Milestone {
  title: string;
  amount: string;
}
export interface GrantApplicationCreateSubgraph {
  grantId: string;
  applicantId: string;
  fields: GrantApplicationFieldsSubgraph;
  milestones: Milestone[]
}

export interface GrantApplicationUpdateSubgraph {
  fields: GrantApplicationFieldsSubgraph;
  milestones: Milestone[]
}
