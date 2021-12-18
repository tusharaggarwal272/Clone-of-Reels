import React, { useState, useEffect } from 'react'
import { auth } from '../firebase'
export const AuthContext = React.createContext();


export function AuthProvider({children}) {

    // console.log(children)
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);

    function signUp(email, password) {
        return auth.createUserWithEmailAndPassword(email, password);
    }
    function login(email, password) {
        return auth.signInWithEmailAndPassword(email, password);
    }
    function logout() {
        // console.log("Logout happengin")
        return auth.signOut();
    }

    useEffect(() => {
        const unsub = auth.onAuthStateChanged((user) => {
            setUser(user)
            setLoading(false);
        })

        return () => {
            unsub();
        }
    }, [])
    const store = {
        user,
        signUp,
        login,
        logout
    }

    return(
        <AuthContext.Provider value={store}>

            {!loading && children}

        </AuthContext.Provider>
        
        )
}