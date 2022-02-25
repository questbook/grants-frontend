import {
  ApplicantEmailError,
  ApplicantNameError,
  BreakdownError,
  FundingAskError,
  MemberDescriptionError,
  MilestoneError,
  MilestoneRewardError,
  ProjectDetailsError,
  ProjectGoalError,
  ProjectLinkError,
  ProjectNameError,
  TeamMemberError,
} from './errorTypes';
import strings from '../../../../../constants/strings.json';

const { errors } = strings.explore_grants.apply.form;

const getApplicantNameErrorText = (error: ApplicantNameError) => {
  switch (error) {
    case ApplicantNameError.NoError:
      return '';
    default:
      return errors.applicant_name[
        error.toString() as keyof typeof errors.applicant_name
      ].message;
  }
};

const getApplicantEmailErrorText = (error: ApplicantEmailError) => {
  switch (error) {
    case ApplicantEmailError.NoError:
      return '';
    default:
      return errors.applicant_email[
        error.toString() as keyof typeof errors.applicant_email
      ].message;
  }
};

const getTeamMemberErrorText = (error: TeamMemberError) => {
  switch (error) {
    case TeamMemberError.NoError:
      return '';
    default:
      return errors.team_members[
        error.toString() as keyof typeof errors.team_members
      ].message;
  }
};

const getMemberDescriptionError = (error: MemberDescriptionError) => {
  switch (error) {
    case MemberDescriptionError.NoError:
      return '';
    default:
      return errors.member_description[
        error.toString() as keyof typeof errors.member_description
      ].message;
  }
};

const getProjectNameErrorText = (error: ProjectNameError) => {
  switch (error) {
    case ProjectNameError.NoError:
      return '';
    default:
      return errors.project_name[
        error.toString() as keyof typeof errors.project_name
      ].message;
  }
};

const getProjectLinkErrorText = (error: ProjectLinkError) => {
  switch (error) {
    case ProjectLinkError.NoError:
      return '';
    default:
      return errors.project_link[
        error.toString() as keyof typeof errors.project_link
      ].message;
  }
};

const getProjectDetailsErrorText = (error: ProjectDetailsError) => {
  switch (error) {
    case ProjectDetailsError.NoError:
      return '';
    default:
      return errors.project_details[
        error.toString() as keyof typeof errors.project_details
      ].message;
  }
};

const getProjectGoalErrorText = (error: ProjectGoalError) => {
  switch (error) {
    case ProjectGoalError.NoError:
      return '';
    default:
      return errors.project_goal[
        error.toString() as keyof typeof errors.project_goal
      ].message;
  }
};

const getMilestoneErrorText = (error: MilestoneError) => {
  switch (error) {
    case MilestoneError.NoError:
      return '';
    default:
      return errors.milestone[
        error.toString() as keyof typeof errors.milestone
      ].message;
  }
};

const getMilestoneRewardErrorText = (error: MilestoneRewardError) => {
  switch (error) {
    case MilestoneRewardError.NoError:
      return '';
    default:
      return errors.milestone_reward[
        error.toString() as keyof typeof errors.milestone_reward
      ].message;
  }
};

const getFundingAskErrorText = (error: FundingAskError) => {
  switch (error) {
    case FundingAskError.NoError:
      return '';
    default:
      return errors.funding_ask[
        error.toString() as keyof typeof errors.funding_ask
      ].message;
  }
};

const getBreakdownErrorText = (error: BreakdownError) => {
  switch (error) {
    case BreakdownError.NoError:
      return '';
    default:
      return errors.breakdown[
        error.toString() as keyof typeof errors.breakdown
      ].message;
  }
};

export {
  getApplicantNameErrorText,
  getApplicantEmailErrorText,
  getTeamMemberErrorText,
  getMemberDescriptionError,
  getProjectNameErrorText,
  getProjectLinkErrorText,
  getProjectDetailsErrorText,
  getProjectGoalErrorText,
  getMilestoneErrorText,
  getMilestoneRewardErrorText,
  getFundingAskErrorText,
  getBreakdownErrorText,
};
