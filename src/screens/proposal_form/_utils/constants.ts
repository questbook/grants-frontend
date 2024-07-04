import { EditorState } from 'draft-js'
import { Form } from 'src/screens/proposal_form/_utils/types'

export const DEFAULT_FORM: Form = { fields: [], milestones: [], members: [], details: EditorState.createEmpty() }
export const DEFAULT_MILESTONE = { index: 0, title: '', amount: 0 }
export const MILESTONE_INPUT_STYLE = [{ placeholder: 'Add milestone', maxLength: 1024 }, { placeholder: 'Funding ask for this milestone' }]

export const disabledGrants = ['0x4494cf7375aa61c9a483259737c14b3dba6c04e6', '0xbf93fc6825b5e9ba9a3d7fcf3d14cdfcf3b4c734', '0x650b4a0dc2aec18f55adb72f13c5d95631db04be', '0x706bc8efecb6002f00a052fe5688d0eb89ea45f4', '0xeb047900b28a9f90f3c0e65768b23e7542a65163', '0x3b16764826f0baa77226327c7c0d7d53f8541913', '0x291d6eb5de3b023ce9b760ef251b303c0c0fd11a', '0xad96ce667e2a09311b439dbdcfcdefd2f98898df']
export const customStepsHeader = ['Creating your proposal']
export const customSteps = [ 'Validating form data', 'Uploading proposal data', 'Submitting your proposal']