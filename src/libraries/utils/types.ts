export type PIIForCommentType = {
    sender?: string
    message?: string
    timestamp?: number
    role?: string
    tags?: string[]
    pii?: {[key: string]: string}
}