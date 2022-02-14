export interface GrantApplicationProps {
  applicantName: string;
  applicantEmail:string;
  teamMembers: number;
  membersDescription: [{ description: string }];
  projectName: string;
  projectLinks: [{ link: string }];
  projectDetails: string;
  projectGoal: string;
  projectMilestones: [{ milestone: string, milestoneReward: string }];
  fundingAsk: string;
  fundingBreakdown: string;

}
