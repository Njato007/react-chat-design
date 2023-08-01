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

// Function to scroll to the bottom of the container
export const scrollToBottom = (containerRef) => {
  if (containerRef.current) {
    containerRef.current.scrollTop = containerRef.current.scrollHeight ;
    console.log('is scrolling to bottom')
  }
};

export const groupByDate = (data) => {
  // this gives an object with dates as keys
  const groups = data.reduce((groups, message) => {
    const time = message.createdAt.toISOString()
    const date = time.split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});
  
  // Edit: to add it in the array format instead
  const groupArrays = Object.keys(groups).map((date) => {
    return {
      date,
      messages: groups[date]
    };
  });

  return groupArrays;
}

export const isFileSizeGreaterThan5MB = (file) => {
  const fiveMBInBytes = 5 * 1024 * 1024; // 5 MB in bytes

  return file.size > fiveMBInBytes;
}


export const MessagesData = [
    {
      user: "receiver",
      message: "This message is from the receiver\nThanks",
      reactions: [],
      createdAt: new Date('2023-07-28')
    },
    {
      user: "receiver",
      message: " It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\n\nThanks",
      reactions: [
        {user: 'sender', emoji: '1f44d'},
      ],
      createdAt: new Date('2023-07-28')
    },
    {
      user: "receiver",
      message: " It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\n\nThanks",
      reactions: [],
      createdAt: new Date('2023-07-29')
    },
    {
      id: "m_01",
      user: "sender",
      message: "This message is from the sender ",
      reactions: [],
      createdAt: new Date('2023-07-29')
    },
    {
      user: "receiver",
      message: "This message is from the receiver\nThanks",
      reactions: [],
      createdAt: new Date('2023-07-30')
    },
    {
      id: 'm_OO',
      user: "receiver",
      message: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.\nLorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      reactions: [
        {user: 'sender', emoji: '2764-fe0f'},
      ],
      replyId: "m_01",
      createdAt: new Date('2023-07-30')
    },
    {
      user: "receiver",
      message: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.\nLorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      reactions: [],
      createdAt: new Date('2023-07-30')
    },
    {
      user: "sender",
      message: " It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\n\nThanks",
      reactions: [
        {user: 'sender', emoji: '1f44d'},
      ],
      replyId: "m_OO",
      createdAt: new Date('2023-07-31')
    },
    
    {
      user: "receiver",
      message: "This message is from the receiver\nThanks",
      reactions: [],
      createdAt: new Date('2023-07-28')
    },
    {
      user: "receiver",
      message: " It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\n\nThanks",
      reactions: [
        {user: 'sender', emoji: '1f44d'},
      ],
      createdAt: new Date('2023-07-28')
    },
    {
      user: "receiver",
      message: " It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\n\nThanks",
      reactions: [],
      createdAt: new Date('2023-07-29')
    },
    {
      user: "sender",
      message: "This message is from the sender ",
      reactions: [],
      createdAt: new Date('2023-07-29')
    },
    {
      user: "receiver",
      message: "This message is from the receiver\nThanks",
      reactions: [],
      createdAt: new Date('2023-07-30')
    },
    {
      user: "receiver",
      message: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.\nLorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      reactions: [
        {user: 'senders', emoji: '2764-fe0f'},
        {user: 'sendersx', emoji: '2764-fe0f'},
      ],
      replyId: "m_01",
      createdAt: new Date('2023-07-30')
    },
    {
      user: "receiver",
      message: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.\nLorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      reactions: [],
      createdAt: new Date('2023-07-30')
    },
    {
      user: "sender",
      message: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\n\nThanks",
      reactions: [
        {user: 'senders', emoji: '1f44d'},
      ],
      createdAt: new Date('2023-07-31')
    },
    {
      user: "receiver",
      message: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\n\nThanks",
      reactions: [],
      createdAt: new Date()
    }
];