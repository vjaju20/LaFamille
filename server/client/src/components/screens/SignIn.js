import React,{useState,useContext} from "react";
import { Link,useHistory } from "react-router-dom";
import { UserContext } from "../../App";
import M from "materialize-css";
const SignIn = () => {
    const {state,dispatch} = useContext(UserContext);
    const history = useHistory();
    const [password,setPassword] = useState("");
    const [email,setEmail] = useState("");
    const PostData = () => {
        fetch("/signin",{
            method : "post",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                password,
                email
            })
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                M.toast({html:data.error,classes:"#f44336 red"})
            }
            else{
                localStorage.setItem("jwt",data.token);
                localStorage.setItem("user",JSON.stringify(data.user));
                dispatch({type:"USER",payload:data.user})
                M.toast({html:"Signed In Successfully",classes:"#43a047 green darken-1"});
                history.push('/'); //if the user is succsessfully signed in it will be redirected to home page
            }
        }).catch(err=>{
            console.log(err);
        })
    }
    return (
        <div className="mycard" style={{position:"relative",top:"80px"}}>
            <div className="card auth-card">
                <h2>LaFamille</h2>
                <input type="text" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <button className="btn waves-effect waves-light #42a5f5 blue darken-1" onClick={()=>PostData()}>Login</button>
                <h5><Link to="/signup">Don't have an account?</Link></h5>
                <h6><Link to="/reset" style={{textDecoration:"underline"}}>Forgot Password</Link></h6>
            </div>
        </div>
    )
}
export default SignIn