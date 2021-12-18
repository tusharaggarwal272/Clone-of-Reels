import React,{useState} from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { database } from '../firebase'

function AddComment(props) {
    // console.log(props)
    const [text,setText]=useState('')
    const handleClick=()=>{
        let obj={
            text:text,
            uProfileImage:props.user.profileUrl,
            uName:props.user.fullname
        }

        database.comments.add(obj).then((doc)=>{
            database.posts.doc(props.post.postId).update({
                comments:[...props.post.comments,doc.id]
            })
        })
        setText('')
    }
    return (
        <div>
            <TextField id='outlined-basic' label="comment" variant="outlined" size='small' style={{width:'70%'}} value={text} onChange={(e)=>setText(e.target.value)}></TextField>
            <Button variant="contained" onClick={handleClick}>Post</Button>
            
        </div>
    )
}

export default AddComment
