export const MentionInputStyle = {
    control: {
      backgroundColor: '#fff',
      fontWeight: 'normal',
    },
  
    '&multiLine': {
      control: {
        // fontFamily: 'monospace',
        minHeight: 0,
      },
      highlighter: {
        padding: 3,
        border: '1px solid transparent',
      },
      input: {
        padding: 3,
        border: '1px solid transparent',
        outline: 'none'
      },
    },
  
    suggestions: {
      list: {
        backgroundColor: 'white',
        border: '1px solid rgba(0,0,0,0.15)',
        // fontSize: 14,
      },
      item: {
        padding: '5px 15px',
        borderBottom: '1px solid rgba(0,0,0,0.15)',
        '&focused': {
          backgroundColor: '#cee4e5',
        },
      },
    },
}
export const MentionPStyle = {
  control: {
    backgroundColor: 'transparent',
    fontWeight: 'normal',

  },

  '&multiLine': {
    control: {
      minHeight: 0,
    },
    highlighter: {
      padding: 0,
      border: '1px solid transparent',
    },
    input: {
      padding: 0,
      border: '1px solid transparent',
      outline: 'none'
    },
  }
}

export const MentionStyle = {
  color: '#000',
  textDecoration: 'underlined'
}