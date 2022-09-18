import React from 'react'
import {
	Box, Flex, Image,
	Text, } from '@chakra-ui/react'
import { EditorState } from 'draft-js'
import Dropdown from 'src/components/ui/forms/dropdown'
import MultiLineInput from 'src/components/ui/forms/multiLineInput'
import RichTextEditor from 'src/components/ui/forms/richTextEditor'
import SingleLineInput from 'src/components/ui/forms/singleLineInput'
import Tooltip from 'src/components/ui/tooltip'

import { useTranslation } from 'react-i18next'

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
  projectName: string
  setProjectName: (projectName: string) => void
  projectNameError: boolean
  setProjectNameError: (projectNameError: boolean) => void

  projectLinks: {
    link: string
    isError: boolean
  }[]
  setProjectLinks: (
    projectLinks: {
      link: string
      isError: boolean
    }[]
  ) => void

  projectDetails: EditorState
  setProjectDetails: (projectDetails: EditorState) => void
  projectDetailsError: boolean
  setProjectDetailsError: (projectDetailsError: boolean) => void

  projectGoal: string
  setProjectGoal: (projectGoal: string) => void
  projectGoalError: boolean
  setProjectGoalError: (projectGoalError: boolean) => void

  projectMilestones: {
    milestone: string
    milestoneReward: string
    milestoneIsError: boolean
    milestoneRewardIsError: boolean
  }[]
  setProjectMilestones: (
    projectMilestones: {
      milestone: string
      milestoneReward: string
      milestoneIsError: boolean
      milestoneRewardIsError: boolean
    }[]
  ) => void

  rewardCurrency: string
  rewardCurrencyCoin: string

  grantRequiredFields: string[]
}) {
	const { t } = useTranslation()
	return (
		<>
			<Text
				fontWeight='700'
				fontSize='16px'
				lineHeight='20px'
				color='#8850EA'>
				{t('/explore_grants/apply.about_proposal')}
				<Tooltip
					icon='/ui_icons/tooltip_questionmark_brand.svg'
					label='Write about your project - idea, use cases, process, goals, and how it helps our ecosystem.'
					placement='bottom-start'
				/>
			</Text>

			<Box mt={6} />
			<SingleLineInput
				label={t('/explore_grants/apply.proposal_title')}
				placeholder=''
				value={projectName}
				onChange={
					(e) => {
						if(projectNameError) {
							setProjectNameError(false)
						}

						setProjectName(e.target.value)
					}
				}
				isError={projectNameError}
				errorText='Required'
				visible={grantRequiredFields.includes('projectName')}
				maxLength={30}
			/>

			{
				projectLinks.map((project, index) => (
					<>
						<Box mt={7} />
						<SingleLineInput
							label={`${t('/explore_grants/apply.supporting_link')} #${index + 1}`}
							placeholder=''
							value={project.link}
							onChange={
								(e) => {
									const newProjectLinks = [...projectLinks]

									const newProject = { ...newProjectLinks[index] }
									if(newProject.isError) {
										newProject.isError = false
									}

									newProject.link = e.target.value
									newProjectLinks[index] = newProject

									setProjectLinks(newProjectLinks)
								}
							}
							isError={project.isError}
							errorText='Required'
							visible={grantRequiredFields.includes('projectLink')}
							inputRightElement={
								index === 0 ? null : (
									<Box
										onClick={
											() => {
												const newProjectLinks = [...projectLinks]
												newProjectLinks.splice(index, 1)
												setProjectLinks(newProjectLinks)
											}
										}
										mt='-78px'
										ml='-32px'
										display='flex'
										alignItems='center'
										cursor='pointer'
									>
										<Image
											h='16px'
											w='15px'
											src='/ui_icons/delete_red.svg'
											mr='6px'
										/>
										<Text
											fontWeight='700'
											color='#DF5252'
											lineHeight={0}>
											Delete
										</Text>
									</Box>
								)
							}
						/>
					</>
				))
			}

			<Text
				fontSize='14px'
				color='#8850EA'
				fontWeight='500'
				lineHeight='20px'
				mt={3}
				cursor='pointer'
				onClick={
					() => {
						setProjectLinks([...projectLinks, { link: '', isError: false }])
					}
				}
				w='fit-content'
				display={grantRequiredFields.includes('projectLink') ? 'block' : 'none'}
			>
				<Image
					display='inline-block'
					h={4}
					w={4}
					mr={2}
					mb='-3px'
					src='/ui_icons/plus_circle.svg'
					alt='link'
				/>
				{t('/explore_grants/apply.add_link')}
			</Text>

			<Box mt={8} />

			<RichTextEditor
				label={t('/explore_grants/apply.proposal_details')}
				placeholder={t('/explore_grants/apply.proposal_details_placeholder')}
				value={projectDetails}
				onChange={
					(e: EditorState) => {
						if(projectDetailsError) {
							setProjectDetailsError(false)
						}

						setProjectDetails(e)
					}
				}
				isError={projectDetailsError}
				errorText='Required'
				visible={grantRequiredFields.includes('projectDetails')}
				maxLength={-1}
			/>

			<Box mt={8} />
			<MultiLineInput
				label={t('/explore_grants/apply.goals')}
				placeholder={t('/explore_grants/apply.goals_placeholder')}
				maxLength={1000}
				value={projectGoal}
				onChange={
					(e) => {
						if(projectGoalError) {
							setProjectGoalError(false)
						}

						setProjectGoal(e.target.value)
					}
				}
				isError={projectGoalError}
				errorText='Required'
				visible={grantRequiredFields.includes('projectGoals')}
			/>

			<Box mt={4} />
			{
				projectMilestones.map(
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
								label={`${t('/explore_grants/apply.milestone')} #${index + 1}`}
								placeholder=''
								value={milestone}
								onChange={
									(e) => {
										const newProjectMilestone = [...projectMilestones]

										const newProject = { ...newProjectMilestone[index] }
										if(newProject.milestoneIsError) {
											newProject.milestoneIsError = false
										}

										newProject.milestone = e.target.value
										newProjectMilestone[index] = newProject

										setProjectMilestones(newProjectMilestone)
									}
								}
								isError={milestoneIsError}
								errorText='Required'
								inputRightElement={
									index === 0 ? null : (
										<Box
											onClick={
												() => {
													const newProjectMilestones = [...projectMilestones]
													newProjectMilestones.splice(index, 1)
													setProjectMilestones(newProjectMilestones)
												}
											}
											mt='-78px'
											ml='-32px'
											display='flex'
											alignItems='center'
											cursor='pointer'
										>
											<Image
												h='16px'
												w='15px'
												src='/ui_icons/delete_red.svg'
												mr='6px'
											/>
											<Text
												fontWeight='700'
												color='#DF5252'
												lineHeight={0}>
												Delete
											</Text>
										</Box>
									)
								}
							/>

							<Box mt={8} />
							<Flex alignItems='flex-start'>
								<Box
									minW='160px'
									flex={1}>
									<SingleLineInput
										label={`${t('/explore_grants/apply.milestone_payout')}`}
										placeholder='100'
										tooltip={t('/explore_grants/apply.milestone_payout_tooltip')}
										tooltipPlacement='bottom-start'
										value={milestoneReward}
										onChange={
											(e) => {
												// console.log(e.target.value)
												const newProjectMilestone = [...projectMilestones]

												const newProject = { ...newProjectMilestone[index] }
												if(newProject.milestoneRewardIsError) {
													newProject.milestoneRewardIsError = false
												}

												newProject.milestoneReward = e.target.value
												newProjectMilestone[index] = newProject

												setProjectMilestones(newProjectMilestone)
											}
										}
										isError={milestoneRewardIsError}
										errorText='Required'
										type='number'
									/>
								</Box>
							</Flex>
						</>
					),
				)
			}

			<Text
				fontSize='14px'
				color='#8850EA'
				fontWeight='500'
				lineHeight='20px'
				mt={3}
				cursor='pointer'
				onClick={
					() => {
						setProjectMilestones([
							...projectMilestones,
							{
								milestone: '',
								milestoneReward: '',
								milestoneIsError: false,
								milestoneRewardIsError: false,
							},
						])
					}
				}
				w='fit-content'
				display={grantRequiredFields.includes('isMultipleMilestones') ? 'block' : 'none'}
			>
				<Image
					display='inline-block'
					h={4}
					w={4}
					mr={2}
					mb='-3px'
					src='/ui_icons/plus_circle.svg'
					alt='link'
				/>
				{t('/explore_grants/apply.add_milestone')}
			</Text>
		</>
	)
}

export default AboutProject
