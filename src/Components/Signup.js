import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import './Signup.css'
import insta from '../Assets/Instagram.jpg';
import { useState, useContext } from 'react'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Link, useHistory } from 'react-router-dom'
import { AuthContext, AuthProvider } from '../Context/AuthContext';
import { database,storage } from '../firebase';


export default function Signup() {


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const { signUp } = useContext(AuthContext)
    const useStyles = makeStyles({
        text1: {
            color: 'grey',
            textAlign: 'center'
        },
        card2: {
            height: '5vh',
            marginTop: '2%'
        }
    })

    const handleClick = async () => {
        if (file == null) {
            setError('Please Upload the file before you Submit');
            setTimeout(() => {
                setError('')
            }, 2000)
            return;
        }
        try {
            setError('')
            setLoading(true)
            let userobj = await signUp(email, password);
            let uid = userobj.user.uid;
            // console.log(uid);
            const uploadtask = storage.ref(`/users/${uid}/ProfileImage`).put(file);
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
                    // console.log(url);
                    database.users.doc(uid).set({
                        email:email,
                        fullname:name,
                        userId:uid,
                        profileUrl:url,
                        createdAt:database.getTimeStamp()
                    })
                })
                setLoading(false);
                history.push('/')
            }
        }
        catch (e) {
            setError(e);
            setTimeout(() => {
                setError('')
            }, 2000)
            // return;
        }

    }
    const classes = useStyles();

    return (

        <div className='signupwrapper'>

            <div className='signupcard'>

                <Card variant='outlined'>

                    <div className='insta-logo'>
                        <img src={insta}></img>
                    </div>

                    <CardContent>
                        <Typography className={classes.text1} variant="subtitle1">
                            Sign up to see photos and videos of your friends
                        </Typography>
                        {
                            error != '' && <Alert severity="error">{error}</Alert>
                        }
                        <TextField id="outlined-basic" label="Email" variant="outlined" margin='dense' fullWidth={true} size='small' value={email} onChange={(e) => setEmail(e.target.value)} />
                        <TextField id="outlined-basic" label="Password" variant="outlined" margin='dense' fullWidth={true} size='small' value={password} onChange={(e) => setPassword(e.target.value)} />
                        <TextField id="outlined-basic" label="Full Name" variant="outlined" margin='dense' fullWidth={true} size='small' value={name} onChange={(e) => setName(e.target.value)} />
                        <Button color="secondary" variant='outlined' fullWidth={true} margin='dense' startIcon={<CloudUploadIcon />} component="label">
                            Upload Profile Image
                            <input type="file" accept="image/*" hidden onChange={(e) => setFile(e.target.files[0])} />
                        </Button>
                    </CardContent>
                    <CardActions>
                        <Button size="small" color="primary" fullWidth={true} variant='contained' disabled={loading} onClick={handleClick}>Sign Up</Button>
                    </CardActions>
                    <CardContent>
                        <Typography className={classes.text1} variant="subtitle1">
                            By Signing up, you agree to our Terms, conditions and Cookies policy.
                        </Typography>

                    </CardContent>
                </Card>

                <Card variant="outlined" className={classes.card2}>
                    <CardContent >

                        <Typography className={classes.text1} variant="subtitle1">
                            Have an Account? <Link to="/login" style={{ textDecoration: 'none' }}>Login</Link>
                        </Typography>
                    </CardContent>

                </Card>

            </div>


        </div>



    );
}
