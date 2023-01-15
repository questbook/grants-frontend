export type PIIForCommentType = {
    sender?: string
    message?: string
    timestamp?: number
    role?: string
    tag?: string
    pii?: {[key: string]: string}
}