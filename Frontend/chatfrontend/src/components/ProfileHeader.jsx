import { useChatStore } from "../store/useChatStore"
import { LogInIcon, LogOut, Volume1Icon, VolumeOff } from "lucide-react"
import { useState, useRef } from "react"
import { useAuthStore } from "../store/useAuthStore"



const ProfileHeader = () => {


    const mouseClickSound = new Audio()
    const fileRef = useRef(null)

    const { isSoundEnabled, toggleSound } = useChatStore()
    const { updatepp, authUser, logout } = useAuthStore()

    const [selectedImg, setselectedImg] = useState(null)

    const handleUpload = (e) => {

        const file = e.target.files[0];
        const reader = new FileReader()

        reader.readAsDataURL(file)

        reader.onloadend = async () => {
            const base64Img = reader.result
            setselectedImg(base64Img)
            await updatepp(base64Img);
        }

    }


    return (
        <div className="p-6 border-b border-slate-700/50">

            <div className="flex items-center justify-between">


                <div className="flex items-center gap-3">

                    <div className="avatar avatar-online">
                        <input type="file" accept="image/**" ref={fileRef} onChange={handleUpload} className="hidden" />

                        <button className="size-14 rounded-full overflow-hidden relative group" onClick={() => fileRef.current.click()}>

                            


                            <img
                                src={selectedImg || authUser.pp || "/avatar.png"}
                                alt="User image"
                                className="size-full object-cover"
                            />

                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span className="text-white text-xs">Change</span>
                            </div>
                        </button>


                    </div>




                    <div>
                        <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">{authUser.fullname}</h3>

                        <p className="text-slate-400 text-xs">Online</p>
                 </div>
                    </div>


                    <div>

                        <button className="text-slate-400 hover:text-slate-200 transition-colors" onClick={logout}
>


                            <LogInIcon className="size-5" />


                        </button>

                        <button className="" onClick={() => { mouseClickSound.currentTime = 0; mouseClickSound.play().catch((error) => { console.log("Error Playing sound", error) }); toggleSound(); }}>

                            {isSoundEnabled ? <Volume1Icon className="size-5" /> : <VolumeOff className="size-5" />}
                        </button>

                    </div>
               

            </div>

        </div>





    )
}

export default ProfileHeader