interface GoogleRecoveryMechanismOptions {
	// Basic options
	googleClientId: string
	folderNameGD: string
	fileNameGD: string

	// Options handling multi key case.
	// TODO add more options maybe?
	allowMultiKeys: boolean
	handleExistingKey: 'Error' | 'Overwrite'
}

export interface Metadata {
    name: string
    parents: string[]
    mimeType: string
}

export type { GoogleRecoveryMechanismOptions }