import {
  Box, Flex, Text, Image,
} from '@chakra-ui/react';
import React from 'react';
import Dropdown from '../../../ui/forms/dropdown';
import MultiLineInput from '../../../ui/forms/multiLineInput';
import SingleLineInput from '../../../ui/forms/singleLineInput';
import Tooltip from '../../../ui/tooltip';
import {
  getMilestoneErrorText,
  getMilestoneRewardErrorText,
  getProjectDetailsErrorText,
  getProjectGoalErrorText,
  getProjectLinkErrorText,
  getProjectNameErrorText,
} from './errors/errorTexts';
import {
  MilestoneError,
  MilestoneRewardError,
  ProjectDetailsError,
  ProjectGoalError,
  ProjectLinkError,
  ProjectNameError,
} from './errors/errorTypes';

function AboutProject({
  projectName,
  setProjectName,
  projectNameError,
  setProjectNameError,

  projectLinks,
  setProjectLinks,

  projectDetails,
  setProjectDetails,
  projectDetailsError,
  setProjectDetailsError,

  projectGoal,
  setProjectGoal,
  projectGoalError,
  setProjectGoalError,

  projectMilestones,
  setProjectMilestones,

  rewardCurrency,
  rewardCurrencyCoin,

  grantRequiredFields,
}: {
  projectName: string;
  setProjectName: (projectName: string) => void;
  projectNameError: ProjectNameError;
  setProjectNameError: (projectNameError: ProjectNameError) => void;

  projectLinks: {
    link: string;
    isError: ProjectLinkError;
  }[];
  setProjectLinks: (
    projectLinks: {
      link: string;
      isError: ProjectLinkError;
    }[]
  ) => void;

  projectDetails: string;
  setProjectDetails: (projectDetails: string) => void;
  projectDetailsError: ProjectDetailsError;
  setProjectDetailsError: (projectDetailsError: ProjectDetailsError) => void;

  projectGoal: string;
  setProjectGoal: (projectGoal: string) => void;
  projectGoalError: ProjectGoalError;
  setProjectGoalError: (projectGoalError: ProjectGoalError) => void;

  projectMilestones: {
    milestone: string;
    milestoneReward: string;
    milestoneIsError: MilestoneError;
    milestoneRewardIsError: MilestoneRewardError;
  }[];
  setProjectMilestones: (
    projectMilestones: {
      milestone: string;
      milestoneReward: string;
      milestoneIsError: MilestoneError;
      milestoneRewardIsError: MilestoneRewardError;
    }[]
  ) => void;

  rewardCurrency: string;
  rewardCurrencyCoin: string;

  grantRequiredFields: string[];
}) {
  return (
    <>
      <Text fontWeight="700" fontSize="16px" lineHeight="20px" color="#8850EA">
        About Project
        <Tooltip
          icon="/ui_icons/tooltip_questionmark_brand.svg"
          label="Write about your project - idea, use cases, process, goals, and how it helps our ecosystem."
          placement="bottom-start"
        />
      </Text>

      <Box mt={6} />
      <SingleLineInput
        label="Project Name"
        placeholder="NFT marketplace on Polygon"
        value={projectName}
        onChange={(e) => {
          if (projectNameError !== ProjectNameError.NoError) {
            setProjectNameError(ProjectNameError.NoError);
          }
          setProjectName(e.target.value);
        }}
        isError={projectNameError !== ProjectNameError.NoError}
        errorText={getProjectNameErrorText(projectNameError)}
        visible={grantRequiredFields.includes('projectName')}
      />

      {projectLinks.map((project, index) => (
        <>
          <Box mt={7} />
          <SingleLineInput
            label={`Project Link ${index + 1}`}
            placeholder="www.project.com"
            value={project.link}
            onChange={(e) => {
              const newProjectLinks = [...projectLinks];

              const newProject = { ...newProjectLinks[index] };
              if (newProject.isError !== ProjectLinkError.NoError) {
                newProject.isError = ProjectLinkError.NoError;
              }
              newProject.link = e.target.value;
              newProjectLinks[index] = newProject;

              setProjectLinks(newProjectLinks);
            }}
            isError={project.isError !== ProjectLinkError.NoError}
            errorText={getProjectLinkErrorText(project.isError)}
            visible={grantRequiredFields.includes('projectLink')}
            inputRightElement={
              index === 0 ? null : (
                <Box
                  onClick={() => {
                    const newProjectLinks = [...projectLinks];
                    newProjectLinks.splice(index, 1);
                    setProjectLinks(newProjectLinks);
                  }}
                  mt="-78px"
                  ml="-32px"
                  display="flex"
                  alignItems="center"
                  cursor="pointer"
                >
                  <Image
                    h="16px"
                    w="15px"
                    src="/ui_icons/delete_red.svg"
                    mr="6px"
                  />
                  <Text fontWeight="700" color="#DF5252" lineHeight={0}>
                    Delete
                  </Text>
                </Box>
              )
            }
          />
        </>
      ))}

      <Text
        fontSize="14px"
        color="#8850EA"
        fontWeight="500"
        lineHeight="20px"
        mt={3}
        cursor="pointer"
        onClick={() => {
          setProjectLinks([
            ...projectLinks,
            { link: '', isError: ProjectLinkError.NoError },
          ]);
        }}
        w="fit-content"
        display={grantRequiredFields.includes('projectLink') ? 'block' : 'none'}
      >
        <Image
          display="inline-block"
          h={4}
          w={4}
          mr={2}
          mb="-3px"
          src="/ui_icons/plus_circle.svg"
          alt="link"
        />
        Add another project link
      </Text>

      <Box mt={8} />

      <MultiLineInput
        placeholder="Write details about your project - requirements, deliverables, and milestones - as detailed as possible."
        label="Project Details"
        value={projectDetails}
        onChange={(e) => {
          if (projectDetailsError !== ProjectDetailsError.NoError) {
            setProjectDetailsError(ProjectDetailsError.NoError);
          }
          setProjectDetails(e.target.value);
        }}
        isError={projectDetailsError !== ProjectDetailsError.NoError}
        errorText={getProjectDetailsErrorText(projectDetailsError)}
        visible={grantRequiredFields.includes('projectDetails')}
      />

      <Box mt={8} />
      <MultiLineInput
        placeholder="Write about what your team plans to achieve with this project"
        label="Project Goals"
        maxLength={1000}
        value={projectGoal}
        onChange={(e) => {
          if (projectGoalError !== ProjectGoalError.NoError) {
            setProjectGoalError(ProjectGoalError.NoError);
          }
          setProjectGoal(e.target.value);
        }}
        isError={projectGoalError !== ProjectGoalError.NoError}
        errorText={getProjectGoalErrorText(projectGoalError)}
        visible={grantRequiredFields.includes('projectGoals')}
      />

      <Box mt={4} />
      {projectMilestones.map(
        (
          {
            milestone,
            milestoneReward,
            milestoneIsError,
            milestoneRewardIsError,
          },
          index,
        ) => (
          <>
            <Box mt={8} />
            <SingleLineInput
              label={`Project Milestone ${index + 1}`}
              placeholder="App Launch on November 30"
              value={milestone}
              onChange={(e) => {
                const newProjectMilestone = [...projectMilestones];

                const newProject = { ...newProjectMilestone[index] };
                if (newProject.milestoneIsError !== MilestoneError.NoError) {
                  newProject.milestoneIsError = MilestoneError.NoError;
                }
                newProject.milestone = e.target.value;
                newProjectMilestone[index] = newProject;

                setProjectMilestones(newProjectMilestone);
              }}
              isError={milestoneIsError !== MilestoneError.NoError}
              errorText={getMilestoneErrorText(milestoneIsError)}
              inputRightElement={
                index === 0 ? null : (
                  <Box
                    onClick={() => {
                      const newProjectMilestones = [...projectMilestones];
                      newProjectMilestones.splice(index, 1);
                      setProjectMilestones(newProjectMilestones);
                    }}
                    mt="-78px"
                    ml="-32px"
                    display="flex"
                    alignItems="center"
                    cursor="pointer"
                  >
                    <Image
                      h="16px"
                      w="15px"
                      src="/ui_icons/delete_red.svg"
                      mr="6px"
                    />
                    <Text fontWeight="700" color="#DF5252" lineHeight={0}>
                      Delete
                    </Text>
                  </Box>
                )
              }
            />

            <Box mt={8} />
            <Flex alignItems="flex-start">
              <Box minW="160px" flex={1}>
                <SingleLineInput
                  label="Expected Milestone Reward"
                  placeholder="100"
                  tooltip="How much money would you need to complete this milestone"
                  tooltipPlacement="bottom-start"
                  value={milestoneReward}
                  onChange={(e) => {
                    console.log(e.target.value);
                    const newProjectMilestone = [...projectMilestones];

                    const newProject = { ...newProjectMilestone[index] };
                    if (
                      newProject.milestoneRewardIsError
                      !== MilestoneRewardError.NoError
                    ) {
                      newProject.milestoneRewardIsError = MilestoneRewardError.NoError;
                    }
                    newProject.milestoneReward = e.target.value;
                    newProjectMilestone[index] = newProject;

                    setProjectMilestones(newProjectMilestone);
                  }}
                  isError={
                    milestoneRewardIsError !== MilestoneRewardError.NoError
                  }
                  errorText={getMilestoneRewardErrorText(
                    milestoneRewardIsError,
                  )}
                  type="number"
                />
              </Box>
              <Box ml={4} mt={5} minW="132px" flex={0}>
                <Dropdown
                  listItemsMinWidth="132px"
                  listItems={[
                    {
                      icon: rewardCurrencyCoin,
                      label: rewardCurrency,
                    },
                  ]}
                />
              </Box>
            </Flex>
          </>
        ),
      )}

      <Text
        fontSize="14px"
        color="#8850EA"
        fontWeight="500"
        lineHeight="20px"
        mt={3}
        cursor="pointer"
        onClick={() => {
          setProjectMilestones([
            ...projectMilestones,
            {
              milestone: '',
              milestoneReward: '',
              milestoneIsError: MilestoneError.NoError,
              milestoneRewardIsError: MilestoneRewardError.NoError,
            },
          ]);
        }}
        w="fit-content"
        display={
          grantRequiredFields.includes('isMultipleMilestones')
            ? 'block'
            : 'none'
        }
      >
        <Image
          display="inline-block"
          h={4}
          w={4}
          mr={2}
          mb="-3px"
          src="/ui_icons/plus_circle.svg"
          alt="link"
        />
        Add another milestone
      </Text>
    </>
  );
}

export default AboutProject;
