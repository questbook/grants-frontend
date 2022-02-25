import {
  GrantSummaryError,
  GrantTitleError,
  GrantDetailsError,
  ExtraFieldError,
  GrantRewardError,
  GrantDeadlineError,
} from './errorTypes';
import strings from '../../../../../constants/strings.json';

const { errors } = strings.your_grants.create_grant.form;

const getGrantTitleErrorText = (error: GrantTitleError) => {
  switch (error) {
    case GrantTitleError.NoError:
      return '';
    default:
      return errors.grant_title[
        error.toString() as keyof typeof errors.grant_title
      ].message;
  }
};

const getGrantSummaryErrorText = (error: GrantSummaryError) => {
  switch (error) {
    case GrantSummaryError.NoError:
      return '';
    default:
      return errors.grant_summary[
        error.toString() as keyof typeof errors.grant_summary
      ].message;
  }
};

const getGrantDetailsErrorText = (error: GrantDetailsError) => {
  switch (error) {
    case GrantDetailsError.NoError:
      return '';
    default:
      return errors.grant_details[
        error.toString() as keyof typeof errors.grant_details
      ].message;
  }
};

const getExtraFieldErrorText = (error: ExtraFieldError) => {
  switch (error) {
    case ExtraFieldError.NoError:
      return '';
    default:
      return errors.extra_field[
        error.toString() as keyof typeof errors.extra_field
      ].message;
  }
};

const getGrantRewardErrorText = (error: GrantRewardError) => {
  switch (error) {
    case GrantRewardError.NoError:
      return '';
    default:
      return errors.grant_reward[
        error.toString() as keyof typeof errors.grant_reward
      ].message;
  }
};

const getGrantDeadlineErrorText = (error: GrantDeadlineError) => {
  switch (error) {
    case GrantDeadlineError.NoError:
      return '';
    default:
      return errors.grant_deadline[
        error.toString() as keyof typeof errors.grant_deadline
      ].message;
  }
};

export {
  getGrantTitleErrorText,
  getGrantSummaryErrorText,
  getGrantDetailsErrorText,
  getExtraFieldErrorText,
  getGrantRewardErrorText,
  getGrantDeadlineErrorText,
};
