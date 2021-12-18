import React, { useState, useEffect } from 'react'
import FavoriteIcon from '@material-ui/icons/Favorite';
import { database } from '../firebase';

function Like(props) {
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
                like==true?<FavoriteIcon className={'icon-styling like'} onClick={handleClick}/>:<FavoriteIcon className={'icon-styling unlike'} onClick={handleClick}/>
                }</>:<></>
            }
        </div>
    )
}

export default Like
