import React,{useState} from "react";
import { useHistory } from "react-router-dom";
import M from "materialize-css";
const ResetPassword = () => {
    const history = useHistory();
    const [email,setEmail] = useState("");
    const ChangePass = () => {
        if(!email){
           return M.toast({html:"Please provide email",classes:"#f4436 red"});
        }
        fetch("/resetpass",{
            method : "post",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                email
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
                <input type="text" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <button className="btn waves-effect waves-light #42a5f5 blue darken-1" onClick={()=>ChangePass()}>Reset Password</button>
            </div>
        </div>
    )
}
export default ResetPassword