import React, { useState, useEffect } from 'react'
import { database } from '../firebase';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';

function Comments(props) {
    const [comments, setComments] = useState(null);
    useEffect(async() => {
        let arr = [];

        for (let i = 0; i < props.post.comments.length; i++) {
            let data = await database.comments.doc(props.post.comments[i]).get()
            arr.push(data.data());
        }
        setComments(arr);
    }, [props.post])
    return (
        <div>
            {
                <>
                    {

                        comments == null ? <CircularProgress /> : comments.map((comment, idx) => (
                            <div style={{display:'flex',alignItems:'center'}}>
                                <Avatar src={comment.uProfileImage}/>
                                <p>&nbsp;&nbsp;<span style={{fontWeight:'bold'}}>{comment.uName}</span>&nbsp;&nbsp;{comment.text} </p>
                            </div>
                        ))
                    }
                </>
            }
        </div>
    )
}

export default Comments
