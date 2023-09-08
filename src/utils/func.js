import axios from 'axios';

const base_url = 'http://localhost:4000'

export const getUsers = async () => {
    const res = await axios.get(`${base_url}/users`);
    return res;
}

export const getUser = async (userId) => {
    const res = await axios.get(`${base_url}/users/${userId}`);
    return res;
}

export const getUserIn = async (arrayOfId) => {
    const idRequest = arrayOfId.map(id => `id=${id}`).join('&');
    const res = await axios.get(`${base_url}/users?${idRequest}`);
    return res;
}

export const signIn = async (auth) => {
    const res = await axios.get(`${base_url}/users?username=${auth.username}&password=${auth.password}`);
    return res;
}

// CHAT
export const getChats = async () => {
    const res = await axios.get(`${base_url}/chats`);
    return res;
}


// CONVERSATIONS
export const getConversations = async (chatId) => {
    const res = await axios.get(`${base_url}/conversations?chatId=${chatId}`);
    return res;
}

export const postConversation = async (data) => {
    const res = await axios.post(
        `${base_url}/conversations`, 
        data,
    )
    return res;
}

export const putConversation = async (convId, data) => {
    const res = await axios.put(
        `${base_url}/conversations/${convId}`, 
        data,
    )
    return res;
}

export const deleteConversation = async (convId) => {
    const res = await axios.delete(
        `${base_url}/conversations/${convId}`
    )
    return res;
}

export const getLastConversation = async (chatId) => {
    const res = await axios.get(`${base_url}/conversations?chatId=${chatId}&_sort=createdAt&_order=desc&_limit=1`);
    return res;
}


export const session = {
    user: () => {
        const local = localStorage.getItem('_user');
        return local ? JSON.parse(local) : null;
    },
    setUser: (user) => {
        if (!user) return;
        localStorage.setItem('_user', JSON.stringify(user));
    }
}