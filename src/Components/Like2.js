import React, { useState, useEffect } from 'react'
import FavoriteIcon from '@material-ui/icons/Favorite';
import { database } from '../firebase';

function Like(props) {
    // console.log(props)
    const [like, setLike] = useState(null);
    useEffect(() => {
        let check = props.post.likes.includes(props.user.userId) ? true : false
        setLike(check)
    }, [props.post])
    const handleClick=()=>{
        if(like==true){
            let narr=props.post.likes.filter((idd)=> idd!=props.user.userId)
            database.posts.doc(props.post.postId).update({
                likes:narr
            })
        }
        else{
            let narr=[...props.post.likes,props.user.userId];
            database.posts.doc(props.post.postId).update({
                likes:narr
            })
        }
    }
    return (
        <div>
            {

                like!=null?<>{
                like==true?<FavoriteIcon style={{padding:'1rem',paddingTop:'0.5rem'}} className={'like'} onClick={handleClick}/>:<FavoriteIcon style={{padding:'1rem',paddingTop:'0.5rem'}} className={'unlike2'} onClick={handleClick}/>
                }</>:<></>
            }
        </div>
    )
}

export default Like
