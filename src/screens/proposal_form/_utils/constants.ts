import { EditorState } from 'draft-js'
import { Form } from 'src/screens/proposal_form/_utils/types'

export const DEFAULT_FORM: Form = { fields: [], milestones: [], members: [], details: EditorState.createEmpty() }
export const DEFAULT_MILESTONE = { index: 0, title: '', amount: 0, details: '', deadline: '' }
export const MILESTONE_INPUT_STYLE = [{ placeholder: 'Add milestone', maxLength: 1024 }, { placeholder: 'Funding ask for this milestone' }, { placeholder: 'Details for this milestone', maxLength: 2048 }, { placeholder: 'Deadline for this milestone' }]

export const customStepsHeader = ['Creating your proposal']
export const customSteps = [ 'Validating form data', 'Uploading proposal data', 'Submitting your proposal']
export const disabledGrants = ['0x4494cf7375aa61c9a483259737c14b3dba6c04e6', '0xbf93fc6825b5e9ba9a3d7fcf3d14cdfcf3b4c734', '0x650b4a0dc2aec18f55adb72f13c5d95631db04be', '0x706bc8efecb6002f00a052fe5688d0eb89ea45f4', '0xeb047900b28a9f90f3c0e65768b23e7542a65163', '0x3b16764826f0baa77226327c7c0d7d53f8541913', '0x291d6eb5de3b023ce9b760ef251b303c0c0fd11a', '0xad96ce667e2a09311b439dbdcfcdefd2f98898df', '6619151a3a7a91313846ed80']
export const disabledTonGrants = ['0x3d9a26d083419d0d6cb0c5d9aed527698254b3ea', '0xe92b011b2ecb97dbe168c802d582037e28036f9b']
export const disabledSubmissions = ['65eb4d301080cbb3447f4b4f']
export const subdomains = [{ name: 'starknet', grants: ['661667585afea0acb56c9f08'], isPrivate: false, isEnabled: false }, { name: 'polygon', grants: ['65eb4d301080cbb3447f4b4f'], isPrivate: true, isEnabled: false }, { name: 'axelar', grants:['661e3ca0f056dd981db4e4a5', '67081a9b8868f5130a7c3896'], isPrivate: true, isEnabled: true }, { grants: ['0x3fcd90092ee9071f084c46459eeaa5a5f8c8dd23'], isPrivate: true, isEnabled: true } ]
export const subdomainProposals = [{ name: 'axelar', grants: ['661e3bf5ccf6446509d2b308', '661e3cc3f056dd981db4e6a6', '65fad2b01080cbb344dbbf24', '661e3c82f056dd981db4e293', '661e3c40ccf6446509d2c01c', '661e3ce1f056dd981db4e795', '661e3ca0f056dd981db4e4a5', '669778c4e1827e9ac9693bf5', '66c2ea652047c84bb81438c0', '67081a9b8868f5130a7c3896'] }, { name: 'ens', grants: ['6619151a3a7a91313846ed80'] }]
export const tonGrants = '65c7836df27e2e1702d2d279'
export const tonAPACGrants = '663d2b4c7d71679fa9959bf6'
export const SocialIntent = ['Just submitted my grant application on @questbookapp! Hoping to make a difference. Check it out and support if you can!', 'Applied for a grant through @questbookapp today! Fingers crossed for positive outcomes. Take a peek at my project and show your support!', 'Thrilled to share that I\'ve applied for a grant via @questbookapp! Excited about the potential impact. Check out my application and help spread the word!', 'Big news! I\'ve just applied for a grant on @questbookapp. Feeling hopeful about the possibilities! Take a look and consider showing your support!', 'Hey friends! Just took a big step and applied for a grant on @questbookapp. Feeling optimistic about the opportunity. Check out my application and show your support.']
export const NewGrants = ['671a105a2047c84bb8a73770']