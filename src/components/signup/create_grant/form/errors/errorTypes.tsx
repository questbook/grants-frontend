enum GrantTitleError {
  NoError = -1,
  InvalidValue = 0,
}

enum GrantSummaryError {
  NoError = -1,
  InvalidValue = 0,
}

enum GrantDetailsError {
  NoError = -1,
  InvalidValue = 0,
}

enum ExtraFieldError {
  NoError = -1,
  InvalidValue = 0,
}

enum GrantRewardError {
  NoError = -1,
  InvalidValue = 0,
}

enum GrantDeadlineError {
  NoError = -1,
  InvalidValue = 0,
  PastDate = 1,
}

export {
  GrantTitleError,
  GrantSummaryError,
  GrantDetailsError,
  ExtraFieldError,
  GrantRewardError,
  GrantDeadlineError,
};
