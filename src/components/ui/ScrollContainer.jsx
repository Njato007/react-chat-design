import { useRef, useEffect, useState, useCallback } from "react";
import { HiOutlineChevronDown } from "react-icons/hi";
import { IoMdRefresh } from "react-icons/io";

const ScrollContainer = ({ children, haveNewMessage, dragActive, onScrollTop, onReadMessage }) => {
  const outerDiv = useRef(null);
  const innerDiv = useRef(null);

  const prevInnerDivHeight = useRef(null);

  const [showNewMessages, setShowNewMessages] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  useEffect(() => {
    setIsLoading(false);
  }, []);

  // scroll to bottom when loading is finished  
  useEffect(() => {
    if (!isLoading) {
      const innerDivHeight = innerDiv.current.clientHeight;
      outerDiv.current.scrollTo({
        top: innerDivHeight,
        behavior: "auto"
      });
      setIsLoading(false);
    }
  }, [isLoading]);
  
  // scroll to bottom when send message or new message comes in
  // depends on scroll position
  useEffect(() => {
    const sh = Math.floor(outerDiv.current.scrollTop + outerDiv.current.clientHeight * 2);
    if (sh > outerDiv.current.scrollHeight) {
      // scroll>ToBottom
      outerDiv.current.scrollTop = outerDiv.current.scrollHeight;
    } else {
      // Pusuh notification here
      setShowNewMessages(true);
    }
  }, [haveNewMessage]);

  const handleScrollButtonClick = useCallback(() => {
    const innerDivHeight = innerDiv.current.clientHeight;

    outerDiv.current.scrollTo({
      top: innerDivHeight,
      left: 0,
      behavior: "smooth"
    });

    setShowScrollButton(false);
  }, []);
  
  const handleScroll = (e) => {
    let element = e.target;
    if (element.scrollTop <= 80) {
      return onScrollTop()
    }
    const outerDivHeight = outerDiv.current;
    // show scroll to bottom button
    const sh = Math.floor(outerDivHeight.scrollTop + outerDivHeight.clientHeight * 2);
    setShowScrollButton(sh < outerDivHeight.scrollHeight);

    const divs = element.querySelectorAll('[receiver]')
    if (divs && divs.length > 0)
      // get each messages id and set into an array
      var unreadMessageId = [...divs].find(e => e.getAttribute('read') === "0")?.id;
      if (unreadMessageId)
        onReadMessage(unreadMessageId);
  }

  return (
    <div className="flex flex-grow relative overflow-hidden bg-gray-50 dark:bg-gray-950">
      <div className="flex flex-col flex-grow w-full scrollbox scrollbox_delayed overflow-x-hidden overflow-y-scroll"
        ref={outerDiv}
        onScroll={handleScroll}
      >
        <div
          className="w-full max-w-6xl mx-auto relative transition-all duration-300 flex px-6 mb-4 flex-col-reverse mt-auto scrollbox-content"
          ref={innerDiv}
          style={{ opacity: !isLoading ? 1 : 0}}
        >
          {children}
        </div>

        {/* Go to bottom button */}
        <div className="absolute right-6 bottom-8"
          style={{zIndex: showScrollButton ? 100 : -1000}}
        >
            <button className="relative p-2 w-fit h-fit bg-slate-200 dark:bg-gray-800 rounded-full cursor-pointer shadow"
                onClick={handleScrollButtonClick}
                style={{ opacity: showScrollButton ? 1 : 0 }}
            >
                <span style={{ opacity: showNewMessages ? 1 : 0 }} className="text-xs rounded-full px-1 absolute -right-1 -top-1 text-white bg-emerald-600 h-fit w-fit">2</span>
                <HiOutlineChevronDown className='w-6 h-6 text-slate-700 dark:text-gray-400' />
            </button>
        </div>
        {
          isLoading && 
          <div className="absolute top-0 left-0 w-full h-full bg-transparent flex items-center justify-center text-2xl z-[1000] text-slate-600">
            <div className="p-2">
              <IoMdRefresh className="w-8 h-8 animate-spin" />
            </div>
          </div>
        }
      </div>
    </div>
  );
};


export default ScrollContainer;