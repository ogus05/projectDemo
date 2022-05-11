declare namespace Express {
    interface Request{
        user: {nickname: string, number: number, community: {
            ID
        }}
    }
}