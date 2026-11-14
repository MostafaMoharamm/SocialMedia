import { createContext, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";

type authContextType  = {
    userLogin : string | null,
    setuserLogin : Dispatch<SetStateAction <string | null>>
}


export const AuthContext = createContext<authContextType>({
    userLogin : null,
    setuserLogin : () => {},
});
export default function AuthContextProvider({children} : {children : ReactNode}){

    const [userLogin, setuserLogin] = useState(function(){return localStorage.getItem("userToken")})
    // useEffect(()=>{
    //     if(localStorage.getItem("userToken")){
    //         setuserLogin(localStorage.getItem("userToken"))
    //     }
    // } , [])




    return <AuthContext.Provider value={{userLogin , setuserLogin}}>


        {children}

    </AuthContext.Provider>
}