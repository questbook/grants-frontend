export type PIIForCommentType = {
    sender?: string
    message?: string
    timestamp?: number
    role?: string
    pii?: {[key: string]: string}
}