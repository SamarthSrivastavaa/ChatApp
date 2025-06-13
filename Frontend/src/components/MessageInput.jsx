import React, { useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore';
import {Image, Send, X } from 'lucide-react';

const MessageInput = () => {
    
    const [text,setText]=useState("");
    const [imagePreview,setImagePreview]=useState(null);
    const {sendMessage}=useChatStore()
    const fileInputRef=useRef(null)
/*No, it should not be at the top of the function because:

You need to define what happens after the file is read (onloadend) before you start reading (readAsDataURL(file)).

If you start reading before setting the callback, the read operation might finish before the callback is registered — especially for small files or fast systems. This means onloadend might never run, or run too late to do anything useful. */
    const handleImageChange=(e)=>{
        const file=e.target.files[0];
        if(!file.type.startsWith("image")){
            toast.error("Not an image!");
            return;
        }
        const reader=new FileReader();
        reader.onloadend=()=>{
            setImagePreview(reader.result);
        }
        reader.readAsDataURL(file);
    }
/*readAsDataURL → returns a base64 string (used for image previews)
readAsText → reads as plain text
readAsArrayBuffer → reads as binary data */

/*This function runs when the file has been completely read (successfully or not).
reader.result now holds the result of the read:
In case of readAsDataURL, this will be a data:image/...;base64,... string
This is commonly passed to img.src or setImagePreview for real-time previews */


    const removeImage=()=>{
        setImagePreview(null);

        //why
        if (fileInputRef.current) fileInputRef.current.value = "";

    }
    const handleSendMessage=async(e)=>{
        e.preventDefault();
        if(!text.trim() && !imagePreview)return;

        
       try {
         sendMessage({
             text:text.trim(),
             image:imagePreview
         })
         //now clearing the input fields
         setText("");
         setImagePreview(null);

         //why
           if (fileInputRef.current) fileInputRef.current.value = "";

       } catch (error) {
              console.error("Failed to send message:", error);
       }

        

    }

  return (
    <div className="p-4 w-full">
        {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}
      {/* above img preview only visible if imagePreview availabale that means an image is selected to upload */}
       <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input  //input text message field
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input  //image input hidden behind icon image button (It does not take any space or act as a block)
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />  

          <button  
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button   //submit btn
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>

    </div>
  )
}

export default MessageInput