export class Auth {
    private userId: number
    private username:string
    private accessToken: string
    private refreshToken: string

    constructor(accessToken, refreshToken, userId, username) {
        this.userId = userId
        this.username = username
        this.accessToken = accessToken
        this.refreshToken = refreshToken
    }
}
