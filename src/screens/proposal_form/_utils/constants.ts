import { EditorState } from 'draft-js'
import { Form } from 'src/screens/proposal_form/_utils/types'

export const DEFAULT_FORM: Form = { fields: [], milestones: [], members: [], details: EditorState.createEmpty() }
export const DEFAULT_MILESTONE = { index: 0, title: '', amount: 0, details: '', deadline: '' }
export const MILESTONE_INPUT_STYLE = [{ placeholder: 'Add milestone', maxLength: 1024 }, { placeholder: 'Funding ask for this milestone' }, { placeholder: 'Details for this milestone', maxLength: 2048 }, { placeholder: 'Deadline for this milestone' }]

export const customStepsHeader = ['Creating your proposal']
export const customSteps = [ 'Validating form data', 'Uploading proposal data', 'Submitting your proposal']
export const disabledGrants = ['0x4494cf7375aa61c9a483259737c14b3dba6c04e6', '0xbf93fc6825b5e9ba9a3d7fcf3d14cdfcf3b4c734', '0x650b4a0dc2aec18f55adb72f13c5d95631db04be', '0x706bc8efecb6002f00a052fe5688d0eb89ea45f4']
export const disabledTonGrants = ['0x3d9a26d083419d0d6cb0c5d9aed527698254b3ea', '0xe92b011b2ecb97dbe168c802d582037e28036f9b']
export const disabledSubmissions = ['65eb4d301080cbb3447f4b4f']
export const tonGrants = '65c7836df27e2e1702d2d279'
export const SocialIntent = ['Just submitted my grant application on @questbookapp! Hoping to make a difference. Check it out and support if you can!', 'Applied for a grant through @questbookapp today! Fingers crossed for positive outcomes. Take a peek at my project and show your support!', 'Thrilled to share that I\'ve applied for a grant via @questbookapp! Excited about the potential impact. Check out my application and help spread the word!', 'Big news! I\'ve just applied for a grant on @questbookapp. Feeling hopeful about the possibilities! Take a look and consider showing your support!', 'Hey friends! Just took a big step and applied for a grant on @questbookapp. Feeling optimistic about the opportunity. Check out my application and show your support.']