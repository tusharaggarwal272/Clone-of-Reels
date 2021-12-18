import React, { useState, useEffect } from 'react'
import { database } from '../firebase'
import CircularProgress from '@mui/material/CircularProgress';
import Video from './Video';
import Avatar from '@mui/material/Avatar';
import './Post.css'
import Like from './Like.js'
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
// import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Like2 from './Like2'
import AddComment from './AddComment';
import Comments from './Comments';

function Posts({ user }) {
    const [posts, setPosts] = useState(null);
    useEffect(() => {
        let parr = [];
        const unsub = database.posts.orderBy('createdAt', 'desc').onSnapshot((querysnapshot) => {
            parr = [];
            querysnapshot.forEach((doc) => {
                let data = { ...doc.data(), postId: doc.id }
                parr.push(data);
            })
            setPosts(parr)
        })
        return unsub

    }, [])
    const [open, setOpen] = React.useState(null);

    const handleClickOpen = (id) => {
        setOpen(id);
    };

    const handleClose = () => {
        setOpen(null);
    };
    const callback = (entries) => {
        entries.forEach((entry)=>{
            let ele = entry.target.childNodes[0]
            // console.log(ele)
            ele.play().then(()=>{
                if(!ele.paused && !entry.isIntersecting){
                    ele.pause()
                }
            })
        })
    }
    let observer = new IntersectionObserver(callback, {threshold:0.6});
    useEffect(()=>{
        const elements = document.querySelectorAll(".videos")
        elements.forEach((element)=>{
            observer.observe(element)
        })

        return ()=>{
            observer.disconnect();
        }
    },[posts])
    return (
        <div>

            {
                posts == null || user == null ? <CircularProgress /> :
                    <div className="video-container">

                        {
                            posts.map((post, index) => (
                                <React.Fragment key={index}>
                                    <div className="videos">

                                        <Video src={post.pUrl} />
                                        <div className='fa' style={{ display: 'flex' }}>
                                            <Avatar src={user.profileUrl} />
                                            <h4>{user.fullname}</h4>
                                        </div>
                                        <div>
                                            <Like user={user} post={post} />
                                            <ChatBubbleIcon className='chat-styling' onClick={handleClickOpen} />
                                            <Dialog
                                                open={open}
                                                onClose={handleClose}
                                                aria-labelledby="alert-dialog-title"
                                                aria-describedby="alert-dialog-description"
                                                fullWidth={true}
                                                maxWidth='md'
                                            >
                                                <div className='modal-container'>
                                                    <div className='video-modal'>
                                                        <video autoPlay={true} muted="muted" controls>
                                                            <source src={post.pUrl}>
                                                            </source>
                                                        </video>
                                                    </div>
                                                    <div className='comment-modal'>
                                                        <Card sx={{ maxWidth: 345 }} className='card1' style={{padding:'1rem'}}>
                                                            <Comments post={post}/>
                                                        </Card>
                                                        <Card variant='outlined' className='card2'>
                                                            <Typography style={{padding:'0.4rem'}}>
                                                                {post.likes.length == 0 ? '' : `Liked by ${post.likes.length} users`}
                                                            </Typography>
                                                            <div style={{ display: 'flex' }}>
                                                                <Like2 user={user} post={post} style={{display:'flex',alignItems:'center',justifyContent:'center'}} />
                                                                <AddComment user={user} post={post} style={{display:'flex',alignItems:'center',justifyContent:'center'}} />
                                                            </div>
                                                        </Card>
                                                    </div>
                                                </div>
                                            </Dialog>
                                        </div>
                                    </div>
                                </React.Fragment>
                            ))
                        }
                    </div>
            }

        </div>
    )
}

export default Posts
