enum ApplicantNameError {
  NoError = -1,
  InvalidValue = 0,
}

enum ApplicantEmailError {
  NoError = -1,
  InvalidValue = 0,
  InvalidFormat = 1,
}

enum TeamMemberError {
  NoError = -1,
  InvalidValue = 0,
}

enum MemberDescriptionError {
  NoError = -1,
  InvalidValue = 0,
}

enum ProjectNameError {
  NoError = -1,
  InvalidValue = 0,
}

enum ProjectLinkError {
  NoError = -1,
  InvalidValue = 0,
  InvalidFormat = 1,
}

enum ProjectDetailsError {
  NoError = -1,
  InvalidValue = 0,
}

enum ProjectGoalError {
  NoError = -1,
  InvalidValue = 0,
}

enum MilestoneError {
  NoError = -1,
  InvalidValue = 0,
}

enum MilestoneRewardError {
  NoError = -1,
  InvalidValue = 0,
}

enum FundingAskError {
  NoError = -1,
  InvalidValue = 0,
}

enum BreakdownError {
  NoError = -1,
  InvalidValue = 0,
}

export {
  ApplicantNameError,
  ApplicantEmailError,
  TeamMemberError,
  MemberDescriptionError,
  ProjectNameError,
  ProjectLinkError,
  ProjectDetailsError,
  ProjectGoalError,
  MilestoneError,
  MilestoneRewardError,
  FundingAskError,
  BreakdownError,
};
