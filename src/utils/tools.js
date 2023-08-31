import { addDays } from "date-fns";
import { Emoji } from "emoji-picker-react";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { render } from "react-dom";
import { createRoot } from "react-dom/client";
import { FiRefreshCw } from "react-icons/fi";
import ReactDOMServer from 'react-dom/server';
import emojilib from 'emojilib'
import { v1 } from "uuid";

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
        return (y > vh - 500) ? { bottom: '40px' } : { top: '40px' };
    }, [x, y]);
}


export const orderByDateFunc = (a, b) => a.createdAt - b.createdAt;

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

const fullReactions = [
  "1f44d", "2764-fe0f", "1f601", "1f602", "1f60b", "2714-fe0f", "1f44c", "1f612", "1f622", "1f60d", "1f497", "1f631"
].map((e, i) => ({ user: `user-${e}`, emoji: e}))

export const MessagesData = [
  {
    id: v1(),
    user: "sender",
    message: "Bonjour :)",
    reactions: [],
    createdAt: addDays(new Date(), 0 ),
    isRead: true,
    seenBy: ["receiver", "sender"]
  },
  {
    id: v1(),
    user: "receiver",
    message: "Ok",
    reactions: [],
    createdAt: addDays(new Date(), 0),
    isRead: true,
    seenBy: ["receiver", "sender"]
  },
  {
    id: v1(),
    user: "sender",
    message: "Nice",
    reactions: [],
    createdAt: addDays(new Date(), 0),
    isRead: true,
    seenBy: ["sender"]
  },
];

export const RandomMessages = (d) => Array.from({length: 10}, (_, index) => {
  const text = "Lorem Ipsum is simply dummy text of the printing and typesetting industry.\nLorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.";
  
  return ({
    id: v1(),
    user: ["receiver", "sender"][Math.floor(Math.random() * 2)],
    message: text.split(' ').slice(0, Math.floor(Math.random() * text.length + 1)).join(' '),
    reactions: [],
    createdAt: addDays(new Date(), 0 - d),
    isRead: true,
    seenBy: ["receiver"]
  })
});


export function useScrollAway(ref, cb) {
  const refCb = React.useRef(cb);

  React.useEffect(() => {
    const handler = (e) => {
      const element = ref.current;
      if (element && !element.contains(e.target)) {
        refCb.current(e);
      }
    };

    document.addEventListener("scroll", handler);
    return () => {
      document.removeEventListener("scroll", handler);
    };
  }, []);

  return ref;
}

export function useOnScreen(ref) {

  const [isIntersecting, setIntersecting] = useState(false)

  const observer = useMemo(() => new IntersectionObserver(
    ([entry]) => setIntersecting(entry.isIntersecting)
  ), [ref])


  useEffect(() => {
    
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return isIntersecting
}

export const firstChar = (word) => word.charAt(0);

export const useTheme = () => {
  const [theme, _setTheme] = useState('light');

  useEffect(() => {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) setTheme(currentTheme);
  }, []);

  const setTheme = (theme) => {
    _setTheme(theme);
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  return { theme, setTheme }
}

// Function to set the caret position
export function setCaretPosition(element, caretPos) {
    const range = document.createRange();
    const selection = window.getSelection();
    range.setStart(element.childNodes[0], caretPos);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    element.focus();
}
// Function to get the selection start position
export function getSelectionStart(element) {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.startContainer, range.startOffset);
      return preCaretRange.toString().length;
  }
  return 0;
}

// Function to get the caret position
export function getCaretPosition(editableDiv) {
  var caretPos = 0,
  sel, range;
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.rangeCount) {
      range = sel.getRangeAt(0);
      if (range.commonAncestorContainer.parentNode == editableDiv) {
        caretPos = range.endOffset;
      }
    }
  } else if (document.selection && document.selection.createRange) {
    range = document.selection.createRange();
    if (range.parentElement() == editableDiv) {
      var tempEl = document.createElement("span");
      editableDiv.insertBefore(tempEl, editableDiv.firstChild);
      var tempRange = range.duplicate();
      tempRange.moveToElementText(tempEl);
      tempRange.setEndPoint("EndToEnd", range);
      caretPos = tempRange.text.length;
    }
  }
  return caretPos;
}

export const insertOverSelection = (element) => {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents(); // Delete the selected content
    range.insertNode(element);

    range.collapse(false);
    selection.removeAllRanges();
  }
};

export const insertPeopleAsElement = (ref, element) => {
  const range = window.getSelection().getRangeAt(0);
  const span = document.createElement('span');
  span.contentEditable = false;
  span.className = 'people'
  span.style.userSelect = 'none'
  const root = createRoot(span);
  root.render(element);
  
  range.deleteContents();
  range.insertNode(span);

  // Move the caret position after the inserted element
  const newRange = document.createRange();
  newRange.setStartAfter(span);
  newRange.collapse(true);

  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(newRange);

  // Focus on the contentEditable div
  ref.current.focus();
};

export const insertEmojiElement = (ref, { emoji, size}) => {
  const range = window.getSelection().getRangeAt(0);
  const img = document.createElement('img');
  img.src = emoji.getImageUrl('google');
  img.alt = emoji.name;
  img.loading = 'eager';
  img.className = '__EmojiPicker__ epr-emoji-img emoji';
  img.contentEditable = true;

  range.deleteContents();
  range.insertNode(img);

  // Move the caret position after the inserted element
  const newRange = document.createRange();
  newRange.setStartAfter(img);
  newRange.collapse(true);

  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(newRange);

  // Focus on the contentEditable div
  ref.current.focus();
};

export const insertMentionElement = () => {
  const range = window.getSelection().getRangeAt(0);
  const span = document.createElement('span');
  span.id = '_mention';
  // span.className = 'at_mention'
  span.contentEditable = true;
  span.innerHTML = '@';
  range.insertNode(span);

  // Move the caret position after the inserted element
  const newRange = document.createRange();
  newRange.setStartAfter(span);
  newRange.collapse(true);

  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(newRange);

  // Focus on the contentEditable span
  return span;
};

export const insertTextNode = (ref, textnode) => {
  const range = window.getSelection().getRangeAt(0);
  const span = document.createElement('span');
  span.contentEditable = false;
  span.style.userSelect = 'none'
  span.innerHTML = textnode;
  range.insertNode(span);

  // Move the caret position after the inserted element
  const newRange = document.createRange();
  newRange.setStartAfter(span);
  newRange.collapse(true);

  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(newRange);

  // Focus on the contentEditable span
  ref.current.focus();
};


export const minimize = (html) => {
  // copy content to avoid reference
  const container = document.createElement('div');
  container.innerHTML = html.innerHTML;
  // minimize emoji image
  const images = container.querySelectorAll('img.emoji');
  for (let image of images) {
    const splited = image.src.split('/');
    const unified = splited[splited.length - 1].split('.')[0];
    image.prepend();
    const textNode = document.createTextNode(`[[:${unified}:]]`);
    image.before(textNode);
    image.remove();
  }
  // minimize people mentioned
  const mentions = container.querySelectorAll('span.people');
  for (let people of mentions) {
    const mention = people.firstElementChild;
    const content = mention.textContent;
    const textNode = document.createTextNode(`{{${content}}}`);
    people.before(textNode)
    people.remove();
  }

  // remove span which contains span
  const spaces = container.querySelectorAll('span');
  for (let span of spaces) {
    if (span.innerHTML == '&nbsp;') {
      span.before(' ');
      span.remove();
    }
  }

  return container.innerHTML;
}

const emojiUrl = (unified) => {
  return `https://cdn.jsdelivr.net/npm/emoji-datasource-google/img/google/64/${unified}.png`;
}

export const maximizeDisplay = (text, editable) => {
  // check emojis

  const regexEmoji = /\[\[:([^:]+):\]\]/;
  var newText = text;
  var matches = '';
  while ((matches = regexEmoji.exec(newText)) !== null) {
    const img = document.createElement('img');
    const unified = matches[1];
    img.src = emojiUrl(unified);
    img.alt = unified;
    img.loading = 'eager';
    img.className = '__EmojiPicker__ epr-emoji-img emoji';
    img.contentEditable = editable ?? false;
    
    newText = newText.replace(matches[0], img.outerHTML);
  }

  // check mention
  const regexTag =/\{\{@([^:]+)\}\}/
  while ((matches = regexTag.exec(newText)) !== null) {
    const tag = <span id={matches[1]} contentEditable={false} className="mentioned_people">@{matches[1]}</span>
    const tagText = ReactDOMServer.renderToString(tag);
    newText = newText.replace(matches[0], tagText);
  }

  return newText;

}

export const moveCursorToLast = (divRef) => {
  const range = document.createRange();
  const selection = window.getSelection();
  if (divRef.current) {
    range.selectNodeContents(divRef.current);
    range.collapse(false); // Move to the end of the content
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

export const insertLine = () => {
  if(getSelection().modify) {     /* chrome */
  var selection = window.getSelection(),
    range = selection.getRangeAt(0),
    br = document.createTextNode('\n');
    range.deleteContents();
    range.insertNode(br);
    range.setStartAfter(br);
    range.setEndAfter(br);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);       /* end chrome */
  } else {
    const newline = document.createTextNode('\n');    /* internet explorer */
    var range = getSelection().getRangeAt(0);
    range.surroundContents(newline);
    range.selectNode(newline.nextSibling);   /* end Internet Explorer 11 */
  }
}

export const trimString = (string) => {
  return string.trim().replace(/&nbsp;/g, ' ');
}


const EmojiSymbols = {
  ':)': '[[:1f642:]]', // smile
  '(:': '[[:1f643:]]', // smile reverse
  ':d': '[[:1f601:]]', // showing teeth
  ';)': '[[:1f609:]]', // winking eye
  ':p': '[[:1f61b:]]', // tongue stuck out
  ';p': '[[:1f61c:]]', // tongue stuck out with winking eye
  '($)': '[[:1f911:]]', // stuck out tongue with dollar
  ':\'(': '[[:1f972:]]', // sad
  '&lt;3': '[[:2764-fe0f:]]' // heart (<3)
}

export const emojifyText = (text = '') => {
  const splits = text.split(' ');
  const emojified = splits.map(split => EmojiSymbols[split.toLowerCase()] ?? split);
  return emojified.join(' ');
}
