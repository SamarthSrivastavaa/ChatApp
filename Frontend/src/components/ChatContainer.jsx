import React, { useEffect } from 'react'
import {useChatStore} from "../store/useChatStore"
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
import MessageSkeleton from './skeletons/MessageSkeleton'
import { useAuthStore } from '../store/useAuthStore'
import { formatMessageTime } from '../lib/utils'
import { useRef } from 'react'
// const messageEndRef=useRef(null);

const ChatContainer = () => {
  const {authUser}=useAuthStore()
  const {messages,getMessages,isMessagesLoading,selectedUser,listenToMessages,stopListeningToMessages}=useChatStore();

  // useEffect(()=>{
  //   if(messageEndRef.current && messages){
  //   messageEndRef.current.scrollIntoView({behaviour:"smooth"})}
  // },[messages])



  useEffect(()=>{
    getMessages(selectedUser._id)  //check the syntax we pass this userId (other person's) in the getmessagws func

    listenToMessages()
    return()=>stopListeningToMessages;

  },[selectedUser._id,getMessages,listenToMessages,stopListeningToMessages])  //check if you need getMessages state as well?
  if(isMessagesLoading){
    return(
      <div className="flex-1 flex flex-col overflow-auto">  {/*flex-1 allows this div to grow and fill all available space. */}
        <ChatHeader />

      <MessageSkeleton />

      <MessageInput />
      </div>
    )
  }

  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />

    <div className='flex-1 overflow-auto p-4 space-y-4'>
  {messages
   .filter((message) => {
  const senderId = message.senderId?.toString?.();
  const receiverId = message.receiverId?.toString?.();
  console.log("Sender:", message.senderId, "Receiver:", message.receiverId);

  return (
    (senderId === authUser._id && receiverId === selectedUser._id) ||
    (senderId === selectedUser._id && receiverId === authUser._id)
    
  );
})

    .map((message) => (
      <div
        key={message._id}
        className={`chat ${message.senderId.toString() === authUser._id ? "chat-end" : "chat-start"}`}  // our messages at right
        // ref={messageEndRef}
      >
        <div className='chat-image avatar'>
          <div className='size-10 rounded-full border'>
            <img
              src={`${
                message.senderId.toString() === authUser._id
                  ? authUser.profilepic || "/avatar.png"
                  : selectedUser.profilepic || "/avatar.png"
              }`}
              alt="profilepic"
            />
          </div>
        </div>
        <div className='chat-header mb-1'>
          <time className='text-xs opacity-50 ml-1'>
            {formatMessageTime(message.createdAt)}
          </time>
        </div>
        <div className='chat-bubble flex flex-col'>
          {message.image && (
            <img
              src={message.image}
              alt="imageMessage"
              className="sm:max-w-[200px] rounded-md mb-2"
            />
          )}
          {message.text && <p>{message.text}</p>}
        </div>
      </div>
    ))}
</div>


      <MessageInput />
    </div>
  )
}

export default ChatContainer