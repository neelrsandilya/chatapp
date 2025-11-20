const ringtoneSounds = [
    new Audio('/sounds/uwu-1736313719546.mp3'),
    new Audio('/sounds/rizz-sound-effect.mp3'),
    new Audio('/sounds/keystroke3.mp3'),
    new Audio('/sounds/Nightcore  Sweet Little Bumblebee (lyric video) - not Mine.mp3'),
]



export const playSound1= () => { 
    
    const newMsg =ringtoneSounds[1]
    newMsg.currentTime=0;
    newMsg.play().catch((error) => { second })
 
 }
export const playSound0= () => { 
    
    const type =ringtoneSounds[0]
    type.currentTime=0;
    type.play().catch((error) => { second })
 
 }
export const sound3 =ringtoneSounds[3]
    
  
 

 

 