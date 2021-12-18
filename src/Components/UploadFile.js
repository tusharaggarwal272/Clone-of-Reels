import React, { useState } from 'react'
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import MovieIcon from '@material-ui/icons/Movie'
import { v4 as uuidv4 } from 'uuid';
import { database,storage } from '../firebase';



export default function UploadFile(props) {
    // console.log(props.user);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleChange = async(file) => {//mere hisab se file yha hi aana chahiye baki 14minutes se dubara dekhna start karenge is comment ko erase karke.

        if (file == null) {
            setError('Please Upload the File first');
            setTimeout(() => {
                setError('');
                return;
            }, 2000);
        }
        if (file.size/ (1024 * 1024) > 100) {
            setError('This Video is very big');
            setTimeout(() => {
                setError('');
            }, 2000);
            return;
        }
        let uid=uuidv4();
        setLoading(true)
        let uploadtask = storage.ref(`/posts/${uid}/${file.name}`).put(file);
        uploadtask.on('state_changed', fn1, fn2, fn3);
        function fn1(snapshot) {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`bytes transferred are ${progress}`)
        }
        function fn2(e) {
            setError(e);
            setTimeout(() => {
                setError('')
            }, 2000)
            setLoading(false)
            return;
        }
        function fn3() {
            uploadtask.snapshot.ref.getDownloadURL().then((url) => {
                let obj={
                    likes:[],
                    comments:[],
                    pUrl:url,
                    pId:uid,
                    uName:props.user.fullname,
                    uProfile:props.user.profileUrl,
                    userId:props.user.userId,
                    createdAt:database.getTimeStamp()
                }
                database.posts.add(obj).then(async(ref)=>{
                    let res=await database.users.doc(props.user.userId).update({
                        postIds:props.user.postIds!=null?[...props.user.postIds,ref.id]:[]
                    })
                }).then(()=>{
                    setLoading(false);
                }).catch((err)=>{
                    setError(err);
                    setTimeout(() => {
                        setError('')
                    }, 2000)
                    setLoading(false);
                })
            })
            
        }
    }
    return (
        <div style={{marginTop:'5rem',marginBottom:'1rem'}}>
            {
                error != '' ? <Alert severity="error">{error}</Alert> : <>
                    <input type="file" accept='video/*' onChange={(e) => handleChange(e.target.files[0])} id="upload-input" style={{ display: 'none' }}></input>
                    <label htmlFor="upload-input">
                        <Button
                            variant='outlined'
                            color="secondary"
                            component="span"
                            disabled={loading}
                        >
                            <MovieIcon />&nbsp; Upload Video

                        </Button>

                    </label>
                    {
                        loading && <LinearProgress color="secondary" style={{ marginTop: '3%' }} />
                    }
                </>
            }
        </div>
    )
}
