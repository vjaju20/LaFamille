//read the comment at the last of the file !important
import React,{useEffect, useState} from "react";
import { Link,useHistory } from "react-router-dom";
import M from 'materialize-css';
const Signup = () => {
    const history = useHistory();
    const [name,setName] = useState("");
    const [password,setPassword] = useState("");
    const [email,setEmail] = useState("");
    const [image,setImage] = useState("");
    const [url,setUrl] = useState(undefined);
    /* in the above line useState we can't null or "" as it will consider it as a value and if the signing up
    user hasn't uploaded any profile pic then our default pic is also not shown and we also can't pass the
    url of the default pic as it will throw an error 422 Unprocessable Enitiy, as undefined isn't considered
    as value so in the backend when we pass undefined server automatically understands that no pic has been
    uploaded so it will take the default pic */
    useEffect(()=>{
        if(url){
            uploadFields();
        }
    },[url])
    const uploadPic = () => {
        const data = new FormData();
        data.append("file",image);
        data.append("upload_preset","insta-clone");
        data.append("cloud_name","varun20");
        fetch("	https://api.cloudinary.com/v1_1/varun20/image/upload",{
            method : "post",
            body : data
        }).then(res=>res.json()).then(data=>{
            setUrl(data.url);
        }).catch(err=>{
            console.log(err)
        })
        /* the above written fetch is used to store the image on the cloudinary */
    }
    const uploadFields = () => {
        if(!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(email)){
            return M.toast({html:"Invalid Email",classes:"#f4436 red"});
        }
        M.toast({html:"Wait for few seconds!",classes:"#ff6f00 amber darken-4"})
        fetch("/signup",{
            method : "post",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                name,
                password,
                email,
                pic:url
            })
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                M.toast({html:data.error,classes:"#f44336 red"})
            }
            else{
                M.toast({html:data.message,classes:"#43a047 green darken-1"});
                history.push('/signin'); //if the user is succsessfully signed up it will be redirected to login page
            }
        }).catch(err=>{
            console.log(err);
        })
    }
    const PostData = () => {
        if(image){
            uploadPic();
        }
        else{
            uploadFields();
        }
    }
    return (
        <div className="mycard"  style={{position:"relative",top:"80px"}}>
            <div className="card auth-card">
                <h2>LaFamille</h2>
                <input type="text" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)}/>
                <input type="text" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <div className="file-field input-field">
                    <div className="btn #42a5f5 blue darken-1">
                        <span>Upload Profile Pic</span>
                        <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text"/>
                    </div>
                </div>
                <button className="btn waves-effect waves-light #42a5f5 blue darken-1" onClick={()=>PostData()}>Signup</button>
                <h5><Link to="/signin">Already have an account?</Link></h5>
            </div>
        </div>
    )
}
export default Signup
/* instead of this "http://localhost:5000/signup" if we write "/signup" then it will go to localhost:3000 but
our server is on localhost:5000 and also if we write the complete above written line then we come across the
CORS problem,i.e.; Cross Origin Resource Sharing which means our app is on 3000 but we are sending the request
on server which is running on 5000 which is not allowed and No 'Access-Control-Allow-Origin' header is present
on the requested resource
So to solve above problems we can install the package cors and then write the line app.use(cors()) in
server's side code but we have a better solution for this
In our client's package.json we just add a single line "proxy": "http://localhost:5000", and our problem is
solved, what this line does is that it will fool our react application as the react thinks that the request
is going to 3000 but internally the request is forwarded to localhost:5000 on which our Nodejs is running
But I have used the first method as proxy not working on my system */