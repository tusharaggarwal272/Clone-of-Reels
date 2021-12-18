import React, { useContext,useEffect,useState} from 'react'
import { AuthContext } from '../Context/AuthContext'
import UploadFile from './UploadFile'
import Posts from './Posts'
import { database } from '../firebase';
import Navbar from './Navbar';

 function Feed() {
    const { user,logout } = useContext(AuthContext);
    const [userData,setuserData]=useState();
    useEffect(() => {
        const unsub=database.users.doc(user.uid).onSnapshot((snapshot)=>{
            setuserData(snapshot.data());
        })
        return ()=>{
            unsub();
        }
    }, [user])
    return (

        <>
        <Navbar user={userData}/>
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
            {/* <div className='comp' style={{width:'50%'}}>
                <h1>Hello</h1>
                <button onClick={logout}>Log out</button>
                
            </div>
            <div> */}
            {/* <h1>Hello</h1> */}
                {/* <button onClick={logout}>Log out</button>
                 */}
                
            <UploadFile user={userData}/>
            <Posts user={userData}/>
            {/* </div> */}
        </div>
        </>
    )
}


export default Feed





