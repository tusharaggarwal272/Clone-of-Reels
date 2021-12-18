import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { database } from '../firebase'
import { CircularProgress } from '@mui/material';
import Navbar from './Navbar';
import Typography from '@mui/material/Typography';
import './Profile.css'
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
import Like2 from './Like2'
import AddComment from './AddComment';
import Comments from './Comments';

function Profile() {
    const { id } = useParams();
    const [userData, setuserData] = useState(null);
    const [posts, setPosts] = useState();
    const [open, setOpen] = React.useState(null);

    const handleClickOpen = (id) => {
        setOpen(id);
    };

    const handleClose = () => {
        setOpen(null);
    };
    useEffect(() => {
        database.users.doc(id).onSnapshot((snap) => {
            setuserData(snap.data());
        })
    }, [id])

    useEffect(async () => {
        if (userData != null) {
            let parr = [];

            for (let i = 0; i < userData.postIds.length; i++) {
                let postData = await database.posts.doc(userData.postIds[i]).get();
                parr.push({...postData.data(),postId:postData.id});
            }
            setPosts(parr);
        }

    })

    return (
        <>
            {
                (posts == null || userData == null) ? <CircularProgress /> :
                    <>

                        <Navbar user={userData} />
                        <div className="spacer"></div>
                        <div className="container">
                            <div className='upper-part'>
                                <div className='profile-img'>
                                    <img src={userData.profileUrl}></img>
                                </div>
                                <div className='info'>
                                    <Typography variant='h5'>
                                        Email:{userData.email}
                                    </Typography>
                                    <Typography variant='h6'>
                                        Posts:{userData.postIds.length}
                                    </Typography>
                                </div>
                            </div>
                            <hr style={{ marginTop: '2rem', marginBottom: '2rem' }} />
                            <div className="profile-videos">

                                {
                                    posts.map((post, index) => (
                                        <React.Fragment key={index}>
                                            <div className="videos">
                                                <video muted="muted" onClick={()=>handleClickOpen(post.pId)}>
                                                    <source src={post.pUrl}>
                                                    </source>
                                                </video>
                                                <div>
                                                    
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
                                                                <Card sx={{ maxWidth: 345 }} className='card1' style={{ padding: '1rem' }}>
                                                                    <Comments post={post} />
                                                                </Card>
                                                                <Card variant='outlined' className='card2'>
                                                                    <Typography style={{ padding: '0.4rem' }}>
                                                                        {post.likes.length == 0 ? '' : `Liked by ${post.likes.length} users`}
                                                                    </Typography>
                                                                    <div style={{ display: 'flex' }}>
                                                                        <Like2 user={userData} post={post} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                                                                        <AddComment user={userData} post={post} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
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
                        </div>




                    </>


            }

        </>
    )
}

export default Profile
