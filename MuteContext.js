import React, { useContext, createContext, useState} from "react";


const MuteContext = createContext();
export const useMute =()=> useContext(MuteContext);

export const MuteProvider = ({children})=>{
    const [isMuted, setIsMuted] = useState(false);
    return(
        <MuteContext.Provider value={{isMuted, setIsMuted}}>
            {children}
        </MuteContext.Provider>
    );
};