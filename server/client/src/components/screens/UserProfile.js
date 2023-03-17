import React,{useEffect,useState,useContext} from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router";
const Profile = () => {
    const [userProfile,setProfile] = useState(null);
    const {state,dispatch} = useContext(UserContext);
    const {userid} = useParams();
    const [showfollow,setshowfollow] = useState(state?!state.following.includes(userid):true);
    /* the above line of code is doing that if the logged in user is a follower then it'll see the unfollow
    button else follow button and as the above line takes a bit of time to work properly so we set the state
    to true while the time loads */
    useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers : {
                Authorization : "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json()).then(result=>{
            //console.log(result);
            setProfile(result);
        })
    },[])
    /* in the whole project wherever we have used empty dependency list with useEffect only so that we
    want this component to kick in for the very first time when the component mounts */
    const followUser = () => {
        fetch('/follow',{
            method : "put",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body : JSON.stringify({
                followId : userid
            })
        }).then(res=>res.json()).then(data=>{
            // console.log(data)
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}});
            localStorage.setItem("user",JSON.stringify(data));
            setProfile((prevState)=>{
                //understand the logic in video 37
                return {
                    ...prevState,
                    user : {
                        ...prevState.user, //this will give us the user whom the logged in user want to follow
                        followers:[...prevState.user.followers,data._id]
                    }
                }
            })
            setshowfollow(false);
        })
    }
    const unfollowUser = () => {
        fetch('/unfollow',{
            method : "put",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body : JSON.stringify({
                unfollowId : userid
            })
        }).then(res=>res.json()).then(data=>{
            // console.log(data)
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}});
            localStorage.setItem("user",JSON.stringify(data));
            setProfile((prevState)=>{
                //understand the logic in video 37
                const newFollower = prevState.user.followers.filter(item=>item !== data._id);
                return {
                    ...prevState,
                    user : {
                        ...prevState.user, //this will give us the user whom the logged in user want to follow
                        followers:newFollower
                    }
                }
            })
            setshowfollow(true);
        })
    }
    return (
        /* what we are doing is that as useEffect take some time to fetch the data,so we are checking if the
        data which is userProfile is present then show the first part else it'll show Loading... */
        /* all the things written in the div like {userProfile.user.name} is according to the output shown
        to us in the console by console.log(result) commented in the useEffect hook */
        <>
        {userProfile ? <div style={{maxWidth:"550px",margin:"0px auto",position:"relative",top:"60px",marginBottom:"80px"}}>
            <div style={{display:"flex",justifyContent:"space-around",flexWrap:"wrap",margin:"18px 0px",borderBottom:"1px solid gray"}}>
                <div>
                    <img style={{width:"160px",height:"160px",borderRadius:"80px"}} alt="" src={userProfile.user.pic}/>
                </div>
                <div>
                    <h4>{userProfile.user.name}</h4>
                    <h5 style={{fontSize:"18px",fontWeight:"500"}}>{userProfile.user.email}</h5>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                        <h6>{userProfile.posts.length} posts</h6>
                        <h6>{userProfile.user.followers.length} followers</h6>
                        <h6>{userProfile.user.following.length} following</h6>
                    </div>
                    {showfollow?<button style={{margin:"10px 0px"}} className="btn waves-effect waves-light #42a5f5 blue darken-1" onClick={()=>followUser()}>Follow</button>
                    :<button style={{margin:"10px 0px"}} className="btn waves-effect waves-light #42a5f5 blue darken-1" onClick={()=>unfollowUser()}>Unfollow</button>}                    
                </div>
            </div>
            <div className="gallery">
                {
                    /* we are only showing the photos */
                    userProfile.posts.map(item=>{
                        return (
                            item.photo.search("video")!==-1?<video className="item" key={item._id} style={{objectFit:"fill"}} controls><source src={item.photo}/></video>:<img className="item" key={item._id} alt={item.title} src={item.photo}/>
                        )
                    })
                }
            </div>
        </div> : <h2 style={{position:"relative",top:"60px"}}>Loading...</h2>}
        </>
    )
}
export default Profile