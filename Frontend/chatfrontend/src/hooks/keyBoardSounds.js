const keyboardSounds = [
    new Audio('/sounds/keystroke1.mp3'),
    new Audio('/sounds/keystroke2.mp3'),
    new Audio('/sounds/keystroke3.mp3'),
    new Audio('/sounds/keystroke4.mp3'),
]

function useKeyBoardSound(){

const playRandomSound =() => { 
    const randomSound =keyboardSounds[Math.floor(Math.random()*keyboardSounds.length)]

   randomSound.currentTime=0;
     
    randomSound.play().catch((error) => { console.log("ErrorPlaying sound") })
 }
return {playRandomSound}

}

export default useKeyBoardSound