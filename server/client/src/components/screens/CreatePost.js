//Read the comments at the end !important
import React,{useState,useEffect} from "react";
import { useHistory } from "react-router-dom";
import M from "materialize-css";
const CreatePost = () => {
    const history = useHistory();
    const [title,setTitle] = useState("");
    const [body,setBody] = useState("");
    const [image,setImage] = useState("");
    const [url,setUrl] = useState("");
    useEffect(()=>{
        if(url){
            /* the below written fetch is to create the post */
            fetch("/createpost",{
                method : "post",
                headers : {
                    "Content-Type" : "application/json",
                    "Authorization" : "Bearer " + localStorage.getItem("jwt")
                },
                body : JSON.stringify({
                    title,
                    body,
                    pic : url
                })
            }).then(res=>res.json()).then(data=>{
                if(data.error){
                    M.toast({html:data.error,classes:"#f44336 red"})
                }
                else{
                    M.toast({html:"Post Created!",classes:"#43a047 green darken-1"});
                    history.push('/'); //if the user is succsessfully signed in it will be redirected to home page
                }
            }).catch(err=>{
                console.log(err);
            })
        }
    },[url])
    const postDetails = () => {
        if(!title||!body){
            return M.toast({html:"Please provide all the details!",classes:"#f4436 red"});
        }
        else if(!image){
            return M.toast({html:"Please choose an image!",classes:"#f4436 red"});
        }
        const data = new FormData();
        data.append("file",image);
        data.append("upload_preset","insta-clone");
        data.append("cloud_name","varun20");
        if(image.type.search("video")===-1){
            M.toast({html:"Wait for few seconds!",classes:"#43a047 green darken-1"});
            fetch("	https://api.cloudinary.com/v1_1/varun20/image/upload",{
                method : "post",
                body : data
            }).then(res=>res.json()).then(data=>{
                setUrl(data.url);
            }).catch(err=>{
                console.log(err)
            })
        }
        else{
            if(image.size>3500000)
                return M.toast({html:"Size should not be more than 3MB!",classes:"#f4436 red"});
            M.toast({html:"Wait for few seconds!",classes:"#43a047 green darken-1"});
            fetch("	https://api.cloudinary.com/v1_1/varun20/video/upload",{
                method : "post",
                body : data
            }).then(res=>res.json()).then(data=>{
                setUrl(data.url);
            }).catch(err=>{
                console.log(err)
            })
        }
        /* the above written fetch is used to store the image on the cloudinary */
    }
    return(
        <div className="card auth-card" style={{maxWidth:"500px",position:"relative",top:"70px"}}>
            <input type="text" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)}/>
            <input type="text" placeholder="Body" value={body} onChange={(e)=>setBody(e.target.value)}/>
            <div className="file-field input-field">
                <div className="btn #42a5f5 blue darken-1">
                    <span>Upload Image/Video</span>
                    <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>
            </div>
            <button className="btn waves-effect waves-light #42a5f5 blue darken-1" onClick={()=>{
                postDetails();
            }}>Submit Post</button>
        </div>
    )
}
export default CreatePost
/* files[0] because on doing console.log we get FileList {0: File, length: 1} and on expanding the FileList
we have all the information of our file in 0: File */
/* we have to first store our images somewhere before sending a network request to our nodejs server and for
this we have used the cloudinary to store our images */
/* in https://api.cloudinary.com/v1_1/varun20/image/upload , https://api.cloudinary.com/v1_1/varun20 is our
API Base URL which we get from cloudinary and /image/upload we have to add to upload our images */
/* we are using the useEffect hook as the createpost fetch will not wait for the other fetch to upload the
image to the cloudinary and change the url and we don't want this so to solve this problem we use the
useEffect hook as it will not allow the createpost fetch to proceed until the image is uploaded on cloudinary
due to the second argument of the useEffect,i.e;Dependency List in which we pass the url and what it does is 
it will proceed after the url is updated and one more thing is we use the if condition in useEffect to make
sure that post is only created when the url is present */