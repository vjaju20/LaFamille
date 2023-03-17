import React,{useEffect,useState,useContext,useRef} from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../App";
import M from "materialize-css";
const Profile = () => {
    const deleteUser = useRef(null);
    const [mypics,setPics] = useState([]);
    const {state,dispatch} = useContext(UserContext);
    const [image,setImage] = useState("");
    const history = useHistory();
    useEffect(()=>{
        fetch('/mypost',{
            headers : {
                Authorization : "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json()).then(result=>{
            //console.log(result);
            setPics(result.mypost)
        })
    },[])
    /* in the whole project wherever we have used empty dependency list with useEffect only so that we
    want this component to kick in for the very first time when the component mounts */
    useEffect(()=>{
        M.Modal.init(deleteUser.current)
    },[])
    useEffect(()=>{
        if(image){
            M.toast({html:"Wait for few seconds!",classes:"#ff6f00 amber darken-4"});
            const data = new FormData();
            data.append("file",image);
            data.append("upload_preset","insta-clone");
            data.append("cloud_name","varun20");
            fetch("	https://api.cloudinary.com/v1_1/varun20/image/upload",{
                method : "post",
                body : data
            }).then(res=>res.json()).then(data=>{
                //console.log(data);
                fetch('/updatepic',{
                    method : "put",
                    headers : {
                        "Content-Type" : "application/json",
                        "Authorization" : "Bearer " + localStorage.getItem("jwt")
                    },
                    body : JSON.stringify({
                        pic : data.url
                    })
                }).then(res=>res.json()).then(result=>{
                    //console.log(result);
                    localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}));
                    dispatch({type:"CHANGEPIC",payload:result.pic})
                })
                M.toast({html:"Profile Pic Changed!",classes:"#ff6f00 amber darken-4"});
            }).catch(err=>{
                console.log(err)
            })
            /* the above written fetch is used to store the image on the cloudinary */
        }
    },[image])
    const changePic = (file) => {
        setImage(file);
    }
    const deleteAccount = (accid) => {
        // console.log(accid);
        fetch(`/deleteacc/${accid}`,{
            method : "delete",
            headers : {
                Authorization : "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json()).then(result=>{
            //console.log(result);
            M.toast({html:result.message,classes:"#f44336 red"})
            localStorage.clear();
            dispatch({type:"CLEAR"})
            history.push("/signin");
        })
    }
    return (
        <div style={{maxWidth:"550px",margin:"0px auto",position:"relative",top:"60px",marginBottom:"80px"}}>
            <div style={{margin:"18px 0px",borderBottom:"1px solid gray"}}>
                <div style={{display:"flex",justifyContent:"center",flexWrap:"wrap"}}>
                    <div>
                        <img style={{width:"160px",height:"160px",borderRadius:"80px"}} alt="" src={state?state.pic:"Loading"}/>
                        <div className="file-field input-field">
                            <div className="btn up #42a5f5 blue darken-1">
                                <span>Change Pic</span>
                                <input type="file" onChange={(e)=>changePic(e.target.files[0])}/>
                            </div><br/>
                            <div style={{display:"none"}} className="file-path-wrapper">
                                <input className="file-path validate" type="text"/>
                            </div>
                            {/* the above div is a neccessity as without it we can't able to upload pic as it
                            will give file-path but we hide it as it doesn't look good and make our app look
                            ugly and we added a br tag to get it into other line */}
                        </div>
                    </div>
                    <div style={{margin:"auto"}}>
                        <h4>{state?state.name:"Loading"}</h4>
                        <h5 style={{fontSize:"18px",fontWeight:"500"}}>{state?state.email:"Loading"}</h5>
                        <div style={{display:"flex",justifyContent:"space-between"}}>
                            <h6>{mypics.length} posts</h6>
                            <h6>{state?state.followers.length:"Loading"} followers</h6>
                            <h6>{state?state.following.length:"Loading"} following</h6>
                        </div>
                        <button data-target="deleteaccount" className="btn #f44336 red modal-trigger" style={{margin:"10px 0px"}}>Delete Account</button>
                    </div>
                    <div id="deleteaccount" className="modal delacc" ref={deleteUser} style={{color:"black"}}>
                        <div className="modal-content">
                            <h6 style={{margin:"8px"}}>Do you really want to delete your account?</h6>
                            <button style={{marginRight:"12px"}} className="btn #f44336 red" onClick={()=>M.Modal.getInstance(deleteUser.current).close()}>No</button><button className="btn #42a5f5 blue darken-1" onClick={()=>deleteAccount(state._id)}>Yes</button>
                        </div>
                    </div>
                </div>
                
            </div>
            <div className="gallery">
                {
                    /* all the properties of item is according to the console in the useEffect hook */
                    mypics.map(item=>{
                        return (
                            item.photo.search("video")!==-1?<video className="item" key={item._id} style={{objectFit:"fill"}} controls><source src={item.photo}/></video>:<img className="item" key={item._id} alt={item.title} src={item.photo}/>
                        )
                    })
                }
            </div>
        </div>
    )
}
export default Profile