import { useAuthStore } from '../store/useAuthstore'
import { useChatStore } from '../store/useChatStore'
import { useState, useRef } from 'react'

import { ImageIcon, SendIcon, XIcon } from 'lucide-react'
import useKeyBoardSound from '../hooks/keyBoardSounds'
import toast from 'react-hot-toast'
import { playSound1 } from '../hooks/ringtoneSounds'
import { playSound0 } from '../hooks/ringtoneSounds'


const MessageInput = () => {

    const fileRef = useRef(null)
    const {playRandomSound}=useKeyBoardSound()

    const { selectedUser, messages, isSoundEnabled, sendMessage } = useChatStore()

    const [imagePreview, setImagePreview] = useState("")
    const [Text, setText] = useState("")



    const handleSend = (e) => {
        e.preventDefault()
        if (!Text.trim() && !imagePreview) return;
        // if(isSoundEnabled) playRandomSound()
        if(isSoundEnabled) playSound1()

        sendMessage({ text: Text.trim(), image: imagePreview })

        setText("")
        setImagePreview("")

        if (fileRef.current) {
            fileRef.current.value = ("");

        }
    }

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

         if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;}


     const reader = new FileReader();

reader.onloadend = () => {
  const base64Img = reader.result;
  setImagePreview(base64Img);
};
reader.readAsDataURL(file);

        
    }

    const removeImage =() => { 
        setImagePreview("")
        if(fileRef.current) fileRef.current.value="";
     }

    const handleChange = (e) => {

        // setText({ ...Text, Text: e.target.value })
        setText(e.target.value);
      //  isSoundEnabled && playRandomSound()
       isSoundEnabled && (playSound0)
    }






  


    return (
        <> 
        <div className='p-4 border-t border-slate-700/50'>
            {imagePreview && ( <div className="max-w-3xl mx-auto mb-3 flex items-center">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-slate-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700"
              type="button"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>)}


            <form onSubmit={ handleSend} disabled={!Text.trim() && !imagePreview} className="max-w-3xl mx-auto flex space-x-4">
           

                <input value = {Text} onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()} type="text" onChange={handleChange} className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 px-4"
          placeholder="Type your message..." />


                <input className=" hidden" ref={fileRef} type="file" accept='image/*' onChange={handleFileUpload} />

                <button    className={`bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg px-4 transition-colors ${
            imagePreview ? "text-cyan-500" : ""
          }`} onClick={ () => { fileRef.current?.click() } }>
                    <ImageIcon className='size-5' />
                </button>

                <button type='submit' className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg px-4 py-2 font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
                    <SendIcon className='size-5' />
                </button>
                </form>
            </div>

        </>





    )
}

export default MessageInput