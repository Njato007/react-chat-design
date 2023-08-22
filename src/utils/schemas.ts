type Room = {
    id: string,
    name: string,
    isGroup: boolean,
    createdAt: Date,
    users: User[],
    lastChat: Chat,
}

type User = {
    id: string,
    firstname: string,
    lastname: string,
    mcode: string,
}

type Chat = {
    id: string,
    roomId: Room,
    text: string,
    createdAt: Date,
    reactions: Reaction[],
    isRead: boolean,
    repliedTo?: Chat,
    seenBy: User[]
}

type Reaction = {
    id: string,
    userId: User,
    emojiCode: string
}