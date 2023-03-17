import React,{useState} from "react";
import { useHistory,useParams } from "react-router-dom";
import M from "materialize-css";
const UpdatePass = () => {
    const history = useHistory();
    const [password,setPassword] = useState("");
    const {token} = useParams();
    const SetNewPass = () => {
        if(!password){
            return M.toast({html:"Please provide password",classes:"#f4436 red"});
        }
        fetch("/newpassword",{
            method : "post",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                password,
                token
            })
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                M.toast({html:data.error,classes:"#f44336 red"})
            }
            else{
                M.toast({html:data.message,classes:"#43a047 green darken-1"});
                history.push('/signin');
            }
        }).catch(err=>{
            console.log(err);
        })
    }
    return (
        <div className="mycard"  style={{position:"relative",top:"70px"}}>
            <div className="card auth-card">
                <h2>LaFamille</h2>
                <input type="password" placeholder="Enter New Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <button className="btn waves-effect waves-light #42a5f5 blue darken-1" onClick={()=>SetNewPass()}>Update Password</button>
            </div>
        </div>
    )
}
export default UpdatePass