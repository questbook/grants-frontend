import { SettingsForm } from 'src/types'

export type EditErrors = { [K in keyof SettingsForm]?: { error: string } };