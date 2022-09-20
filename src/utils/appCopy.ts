import { initReactI18next } from 'react-i18next'
import i18next from 'i18next'

i18next.use(initReactI18next).init({
	fallbackLng: 'en',
	resources: {
		en: {
			translation: {
				'/': {
					'sorting' : {
						'amount' : 'Grant Amount',
						'number_of_proposals': 'Number of Proposals',
					},
					'section_1': {
						'title': 'Most Active',
					},
					'section_2': {
						'title': 'New',
					},
					'get_started_card' : {
						'title': 'Want to attract builders?',
						'description': '20k builders are active here. Request proposals from them and give out grants.',
						'cta': 'Get Started',
					},
					'cards': {
						'proposals': 'proposals',
						'in_grants': 'sent in grants',
						'submit_proposal': 'Submit Proposal',
					},
					'show_more': 'Show More',
					'create-program': 'Create',
				},
				'/profile': {
					'grants_disbursed': 'Sent in Grants',
					'proposals': 'Proposals',
					'accepted': 'Accepted',
					'embed_stats': 'Embed Stats',
					'browse': 'Browse',
					'more_info': 'More Info',
					'cards': {
						'accepting_proposals_until': 'Accepting Proposals till',
						'submit_proposal': 'Submit Now',
						'per_proposal': 'avg. per proposal',
						'proposal': 'proposal',
						'created_ago': 'Created TIME_DIFF ago'
					}
				},
				'/explore_grants/about_grant': {
					'accepting_proposals_till': 'Accepting Proposals till',
					'was_accepting_proposals_till': 'Accepting Proposals till',
					'by': 'By',
					'grant_amount': 'Grant Amount',
					'payouts': 'Payouts',
					'multiple_payouts': 'Amount split across multiple milestones',
					'single_payout': 'Amount paid in one go',
					'proposal_format': 'Proposal Format',
					'submit_proposal': 'Submit Proposal',
					'already_submitted': 'Already Submitted',
					'already_submitted_desc': 'You’ve already submitted the proposal. View the details',
				},
				'/explore_grants/apply' : {
					'your_proposal': 'Your Proposal',
					'proposer_details': 'Proposer Details',
					'name': 'Name',
					'name_placeholder': 'John Doe',
					'email': 'Email',
					'team': 'Team',
					'team_members': 'Team Members',
					'team_members_desc': 'Add team members to your proposal',
					'address': 'Wallet Address',
					'your_address_on': 'Your wallet address on',
					'num_team_members': 'Number of team members',
					'member': 'member #',
					'about_proposal': 'About Proposal',
					'proposal_title': 'Proposal Title',
					'supporting_link': 'Supporting Link',
					'add_link': 'Add Another Link',
					'proposal_details': 'Details',
					'proposal_details_placeholder': 'Effective proposals include mocks, key considerations, impact on the ecosystem and any other detail relevant to the proposal.',
					'goals': 'Goals',
					'goals_placeholder': 'What is the impact for the ecosystem that you wish to achieve?',
					'milestone': 'Milestone',
					'milestone_payout': 'Expected Payout for Milestone (in USD)',
					'add_milestone': 'Add another milestone',
					'milestone_payout_tooltip': 'The actual amount the review committee may approve for this milestone can differ from this.',
					'funding_ask': 'Funding Ask',
					'funding_breakdown': 'Funding Breakdown',
					'funding_breakdown_placeholder': 'Where will you likely be spending this grant?',
					'invalid_address_on_chain': 'Invalid address on %CHAIN',
				},
				'/onboarding/create-domain': {
					'attach_safe':'Link a funding source',
					'attach_safe_desc':'Linking a funding source will give confidence to builders.',
					'multisig_safe_address': 'Multisig Address',
					'multisig_safe_address_helper': 'Supported Multisig Wallets: Gnosis Safe and Realms',
					'looking_for_safe': 'Looking up safes with this address on different networks...',
					'safe_found' : 'Safe with this address was found on one network',
					'safes_found' : 'Multiple safes with this address were found on multiple networks',
					'pick_network_helptext': 'Pick the network from which you want to do payouts on Questbook.',
					'pick_network_placeholder' : 'Pick a network',
					'program_name_title': '',
					'program_name': 'Give it a name',
					'program_name_helper': 'Typically name reflects an area of focus for your ecosystem growth',
					'program_name_placeholder': 'e.g. Compound Risk Parameter Research Grants',
					'create': 'Create',
					'verify_signer': 'Please verify you’re a signer on this SAFE. This will ensure we don’t have impersonation.',
					'verify_signer_title': 'Verify you’re a signer',
					'verify_signer_desc': 'Connect your wallet which is a signer on the Multisig.',
					'success': 'Success',
					'next_create_grant': 'Next create a grant to invite proposals from builders',
					'successful_verification' : 'You\'ve successfully verified you\'re a signer on this multisig wallet.',
				},
				'/create-grant' : {
					'title': 'Create a Grant to attract builders',
					'title_label' : 'Title',
					'title_placeholder' : 'e.g. Grant for dev tooling',
					'summary_label': 'Summary',
					'summary_placeholder': 'Explain what you’re looking for in a proposal',
					'details_label': 'Details',
					'instructions_title': 'Instructions for a good proposal',
					'proposal_form': {
						'title': 'What details are required in a Proposal?',
					},
					'amount': 'Recommended Grant Amount (in USD)',
					'deadline': 'Accepting Proposals till',
					'private_review': 'Keep proposal reviews private',
					'private_review_desc': 'Reviews and comments by your team will be kept private to you and the reviewers',

				},
				'/your-grant' : {
					'post_grant': 'Post a new Grant',
					'cards': {
						'proposals': 'proposal',
					}
				},
				'/your_grants/view_applicants': {
					'edit_review_process': 'Edit Review Process',
					'create_review_process': 'Create Review Process',
					'view_review_process': 'View Review Process',
					'create_review_no_reviewers': 'You have not added any reviewers. Invite them to setup a review process. Reviewers will be automatically assigned to new proposals.',
					'no_proposals_on_archived' : 'No proposals can be submitted to this grant as it is archived.',
					'invite_reviewers': 'Invite Reviewers',
					'archive_grant': 'Archive Grant',
					'proposals': 'Proposals',
					'reviews_completed': 'Reviews Completed',
					'sent': 'Sent',
					'no_accepted': 'You have not accepted any proposals yet',
					'no_accepted_description': 'Accept proposals from the "In Review" tab. You can send funds only to accepted proposals.',
					'no_in_review': 'There are no new proposals',
					'no_in_review_description': 'New proposals will appear here. You can review them and accept or reject them.',
					'no_rejected': 'You have not rejected any proposals yet',
					'no_rejected_description': 'Reject proposals from the "In Review" tab.',
					'no_resubmissions': 'You have not asked any proposal to be resubmitted',
					'no_resubmissions_description': 'You can ask for clarifications by asking proposals to be resubmitted with changes',
					'create_review_process_help': 'Setup questions reviewers will be asked to answer when reviewing proposals.',
					'review_questions': 'How to review?',
					'select_reviewers': 'Who will review?',
					'select_reviewers_next': 'Pick Reviewers',
					'review_process_save': 'Save Review Process',
					'reviewer_question': 'Question for reviewer',
					'reviewer_question_description': 'Describe how you want the reviewer to answer this question',
					'add_question': 'Add another question',
					'how_many_reviewers': 'How many reviewers do you want to review each proposal?',
					'how_many_reviewers_description': ' reviewer will be randomly assigned to each proposal',
					'pick_reviewers': 'Pick reviewers who will review proposals for this grant',
					'make_reviews_private': 'Make reviews private',
					'make_reviews_private_description': 'Reviews and comments by your team will be kept private to you and the reviewers',
					'send_funds': 'Send Grant',
					'send_funds_description': 'Send money from your multisig wallet',
					'send_funds_recipient' : 'Grant Details',
					'send_funds_verify': 'Verify ownership of multisig wallet',
					'address_on_chain': 'Address on %CHAIN',
					'invalid_address_on_chain': 'Invalid address on %CHAIN',
					'send_funds_milestone': 'Milestone Completed',
					'send_funds_milestone_description': 'Select the milestone you are sending this grant for',
					'send_funds_verification_message': 'You will be asked to verify that you are a signer on the multisig wallet. This will ensure we don’t have impersonation.',
					'send_funds_next_steps': 'Here are the next steps',
					'send_funds_open_txn': 'Open the transaction in multi-sig', },
				'/manage_dao': {
					'create_link': 'Create invite link',
					'create_link_description': 'Share this link only with your team member. One invite link can be used exactly once.',
					'role_info': 'Admins have full access. Reviewers can only review applications, they can’t send funds.',
					'ecosystem_growth_program_name': 'Ecosystem Growth Program Name',
					'about': 'About',
					'about_description': 'Write details about opportunities in your ecosystem for builders. Details of your grant, bounty and other programs.  your grants, bounty, and other projects.',
				},
				'/dashboard': {
					'title': 'Stats',
					'proposals': 'Total Proposals',
					'unique_teams': 'Unique Teams',
					'repeat_teams': 'Repeat Teams',
					'accepted_proposals': 'Accepted Proposals',
					'tat': 'Turn around time',
					'proposals_received': 'Proposals Received',
					'amount_sent': 'Amount Sent',
				},
				'/safe': {
					'balance': 'Balance',
					'could_not_fetch': 'Could not fetch balance',
					'open': 'Open multisig wallet',
					'note': 'All grants will be paid out from this multisig wallet.',
					'learn_more': 'Learn more about multisig wallets',
				},
				'/your_applications': {
					'your_proposals': 'My Proposals',
					'submit_milestone': 'Submit Milestones',
					'view_application': 'View Proposal',
				},
				'/your_applications/manage_grant': {
					'open_application': 'Open My Proposal',
					'mark_as_done' : 'Submit milestone for review',
					'mark_as_done_description': 'Add what you achieved as part of this milestone along with links'
				}
			},

		},
	},
})
