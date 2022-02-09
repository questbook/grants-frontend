import React from 'react';
import HeroTip from './heroTip';
import TipsList from './tipsList';

interface Props {
  currentTip: number;
}

const TipsContainer = ({ currentTip }: Props) => {
  const tips = [
    <HeroTip key={0} />,
    <TipsList
      tips={[
        'Be as transparent as you can about the decision making.',
        'If you want a specific kind of eligibility criteria, mention it. You would not want the applicants to learn it after submitting application.',
        'Give clear instructions for the applicants on how to reach out to you.',
      ]}
      key={1}
      icon="/illustrations/grant_proposal.svg"
    />,
    <TipsList
      tips={[
        'Be as transparent as you can about the decision making.',
        'If you want a specific kind of eligibility criteria, mention it. You would not want the applicants to learn it after submitting application.',
        'Give clear instructions for the applicants on how to reach out to you.',
      ]}
      icon="/illustrations/grant_proposal.svg"
      key={2}
    />,
    <TipsList
      tips={[
        'Add funds to approve disbursal of funds instantly. ',
        "Your funds are not stored with us. It's on our smart contract. Learn more",
        'For milestone payouts, do mention milestones in your grant details.',
      ]}
      icon="/illustrations/grant_reward.svg"
      key={3}
    />,
  ];
  return tips[currentTip];
};

export default TipsContainer;
