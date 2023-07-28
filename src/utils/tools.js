import { useCallback } from "react";

export const useAxesStyle = (x, y) => {
    return useCallback(() => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const pix = (n) => `${n}px`;
        var axes = {
            top: pix(y),
            left: pix(x),
        }
    
        if (x > vw / 3) {
            axes = {
                right: pix(vw - x),
                top: pix(y),
            }
        } 
        if (y > (vh / 2)) {
            axes.bottom = pix(vh - y);
            delete axes.top;
        }
    
        return axes;
    }, [x, y]);
}

export const useReactionAxes = (x, y) => {
    return useCallback(() => {
        const vh = window.innerHeight;
        return (y > vh - 200) ? { bottom: '40px' } : { top: '40px' };
    }, [x, y]);
}

export const MessagesData = [
    {
      user: "receiver",
      message: "This message is from the receiver\nThanks",
      reactions: []
    },
    {
      user: "receiver",
      message: " It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\n\nThanks",
      reactions: [
        {user: 'sender', emoji: '1f44d'},
      ]
    },
    {
      user: "receiver",
      message: " It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\n\nThanks",
      reactions: []
    },
    {
      user: "sender",
      message: "This message is from the sender ",
      reactions: []
    },
    {
      user: "receiver",
      message: "This message is from the receiver\nThanks",
      reactions: []
    },
    {
      id: 'm_OO',
      user: "sender",
      message: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.\nLorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      reactions: [
        {user: 'sender', emoji: '2764-fe0f'},
      ]
    },
    {
      user: "receiver",
      message: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.\nLorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      reactions: []
    },
    {
      user: "sender",
      message: " It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\n\nThanks",
      reactions: [
        {user: 'sender', emoji: '1f44d'},
      ],
      reply: "m_OO"
    }
];