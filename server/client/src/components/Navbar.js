import React,{useContext,useRef,useEffect,useState} from "react";
import { Link,useHistory,useLocation } from "react-router-dom";
import { UserContext } from "../App";
import M from "materialize-css";
const NavBar = ()=>{
    /* instead of anchor tag we are using the Link component from react-router-dom so that our application
    don't refresh every time the user click on a link */
    const searchModal = useRef(null);
    const sideNav = useRef(null);
    const [search,setSearch] = useState("");
    const [userName,setUserName] = useState([])
    const {state,dispatch} = useContext(UserContext);
    const history = useHistory();
    const location = useLocation();
    useEffect(()=>{
        M.Modal.init(searchModal.current)
    },[]);
    const renderList = () => {
        /* state is like a user in the sense that it has the user details and the token */
        /* we're adding keys to remove the unique key in a list warning from our console */
        if(state){
            return [
                <li key="1" className="lisrh"><i data-target="searchusers" className="material-icons srhbtn modal-trigger" style={{color:"black"}}>search</i></li>,
                <li key="2"><Link to="/profile" onClick={()=>M.Sidenav.init(sideNav.current).close()}>Profile</Link></li>,
                <li key="3"><Link to="/create" onClick={()=>M.Sidenav.init(sideNav.current).close()}>Create Post</Link></li>,
                <li key="4"><Link to="/myfollowingpost" onClick={()=>M.Sidenav.init(sideNav.current).close()}>Followed Users Posts</Link></li>,
            ]
        }
        else{
            return [
                <li key="6"><Link to="/signin">Signin</Link></li>,
                <li key="7"><Link to="/signup">Signup</Link></li>
            ]
        }
    }
    const fetchUsers = (username) => {
        setSearch(username);
        fetch('/search-users',{
            method:"post",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({
                username
            })
        }).then(res=>res.json()).then(result=>{
            //console.log(result)
            setUserName(result.user)
        })
    }
    return(
        <>
        <nav className="nav-extended">
            <div className="nav-wrapper teal lighten-2" style={{position:"fixed",top:"0vh",width:"100%",zIndex:"1"}}>
                <Link to={state?"/":"/signin"} className={state?"brand-logo":"brand-logo left"}>LaFamille</Link>
                {state?<Link to={location.pathname} data-target="mobile-demo" className="sidenav-trigger" onClick={()=>M.Sidenav.init(sideNav.current).open()}><i className="material-icons" style={{color:"black"}}>menu</i></Link>:<ul className="right">{renderList()}</ul>}
                {/* hide-on-med-and-down hide the ul on medium and less than medium sized screens if added */}
                <ul id="nav-mobile" className="right hide-on-med-and-down" style={{position:"relative",right:"8.5vw"}}>
                    {/* <li><Link to="/signin">Signin</Link></li>
                    <li><Link to="/signup">Signup</Link></li>
                    <li><Link to="/profile">Profile</Link></li>
                    <li><Link to="/create">Create Post</Link></li> */}
                    {state?renderList():null}
                </ul>
                {state?<button className="btn #f44336 red right logout" style={{position:"absolute",right:"1vw"}} onClick={()=>{
                    localStorage.clear();
                    dispatch({type:"CLEAR"})
                    history.push('/signin')
                    setUserName([])
                }}>Logout</button>:null}
            </div>
            <div id="searchusers" className="modal" ref={searchModal} style={{color:"black"}}>
                <div className="modal-content" style={{paddingBottom:"1px"}}>
                    <input type="text" placeholder="Search User(s) (First letter should be capital)" key="9" value={search} onChange={(e)=>fetchUsers(e.target.value)}/>
                    <ul className="collection" style={{display:"grid",marginBottom:"0px"}}>
                        {userName.map(item=>{
                            return <Link id="userlist" to={item._id !== state._id ? "/profile/"+item._id : "/profile"} onClick={()=>{M.Modal.getInstance(searchModal.current).close();setSearch('')}}><li className="collection-item">{item.name}</li></Link>
                        })}
                    </ul>
                </div>
                <div className="modal-footer" style={{paddingTop:"0px"}}>
                    <button style={{marginTop:"0px"}} className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>Close</button>
                </div>
            </div>
        </nav>
        <ul className="sidenav" ref={sideNav} id="mobile-demo">
            {/* <li key="111"><i data-target="searchusers" className="material-icons modal-trigger" style={{color:"black",padding:"16px 32px 0"}}>search</i></li>
            <li key="10"><Link to="/profile" onClick={()=>M.Sidenav.init(sideNav.current).close()}>Profile</Link></li>
            <li key="11"><Link to="/create" onClick={()=>M.Sidenav.init(sideNav.current).close()}>Create Post</Link></li>
            <li key="12"><Link to="/myfollowingpost" onClick={()=>M.Sidenav.init(sideNav.current).close()}>Followed Users Posts</Link></li> */}
            {renderList()}
        </ul>
        </>
    )
}
export default NavBar;
/* in the ul initially we used the commented part but then we replace it with a function because we want that
when the user is logged in we want to only show Profile and Create Post links in our Navbar and if the user
isn't signed in or new to the application we want the other two links to be shown */