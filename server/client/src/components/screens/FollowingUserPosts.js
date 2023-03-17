import React,{useState,useEffect,useContext} from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";
const Home = () => {
    const [data,setData] = useState([]);
    const {state,dispatch} = useContext(UserContext);
    useEffect(()=>{
        fetch('/getflwgspost',{
            headers : {
                Authorization : "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json()).then(result=>{
            //console.log(result.posts);
            setData(result.posts);
        })
    },[])
    const likePost = (id) => {
        fetch('/like',{
            method : "put",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body : JSON.stringify({
                postId : id
            })
        }).then(res=>res.json()).then(result=>{
            const newData = data.map(item=>{
                if(item._id===result._id){
                    return result;
                }
                else{
                    return item;
                }
            })
            setData(newData);
        }).catch(err=>{
            console.log(err)
        })
    }
    const unlikePost = (id) => {
        fetch('/unlike',{
            method : "put",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body : JSON.stringify({
                postId : id
            })
        }).then(res=>res.json()).then(result=>{
            const newData = data.map(item=>{
                if(item._id===result._id){
                    return result;
                }
                else{
                    return item;
                }
            })
            setData(newData);
        }).catch(err=>{
            console.log(err)
        })
    }
    const makeComment = (text,postId) => {
        fetch('/comment',{
            method : "put",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body : JSON.stringify({
                postId,
                text
            })
        }).then(res=>res.json()).then(result=>{
            //console.log(result);
            const newData = data.map(item=>{
                if(item._id===result._id){
                    return result;
                }
                else{
                    return item;
                }
            });
            setData(newData)
        }).catch(err=>{
            console.log(err);
        })
    }
    return (
        /* all things written in the div with using item.{property} is according to the console.log in the
        useEffect hook */
        <div className="home"  style={{position:"relative",top:"60px"}}>
            {
                data.map(item=>{
                    return (
                        <div className="card home-card" key={item._id}>
                            <h5 style={{padding:"5px"}}><img src={item.postedBy.pic} style={{height:"32px",width:"32px",position:"relative",top:"7px",marginLeft:"5px",marginRight:"5px",borderRadius:"50%"}}/>
                            <Link to={"/profile/"+item.postedBy._id}>{item.postedBy.name}</Link></h5>
                            <div className="card-image">
                                {item.photo.search("video")!==-1?<video style={{maxHeight:"450px",width:"100%",objectFit:"fill"}} controls><source src={item.photo}/></video>:<img style={{maxHeight:"400px"}} alt="photo" src={item.photo}/>}
                            </div>
                            <div className="card-content">
                            {item.likes.includes(state._id)?
                                <i className="material-icons" style={{color:"red"}} onClick={()=>{unlikePost(item._id)}}>favorite</i>
                                :<i className="material-icons" style={{color:"red"}} onClick={()=>{likePost(item._id)}}>favorite_border</i>}
                                {/* we know that on any site we can like and unlike post only once and this is
                                exactly what the above line of code does, if the user is already present in the
                                likes array of the post then we hide the like button and show up the unlike
                                button and vice-versa */}
                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record=>{
                                        return(
                                            <h6 key={record._id}><Link to={record.postedBy._id!==state._id?"/profile/"+record.postedBy._id:"/profile"}><span style={{fontWeight:"500"}}>{record.postedBy.name}</span></Link> {record.text}</h6>
                                        )
                                    })
                                    /* the above whole thing adds the comment along with the name of the user
                                    who has written it */
                                }
                                <form onSubmit={(e)=>{
                                    e.preventDefault();
                                    /* we are using the above line so that our browser is not refreshed after submitting
                                    the comment */ 
                                    //console.log(e.target[0].value)
                                    /* By e.target[0].value we get the comment written by the user as e.target is form
                                    and it has only one input tag so e.target[0] is input and .value is the comment */
                                    makeComment(e.target[0].value,item._id)
                                    e.target[0].value = "";
                                }}>
                                    <input type="text" placeholder="Add comment..."/>
                                </form>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}
export default Home