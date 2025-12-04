import './Login.css';
import { useNavigate } from "react-router";
export const Login = () =>{
  let navigate = useNavigate();

    return(
    <div className="background">
        <div className="foreground">
          <h1>Login</h1>
          <label>
            Username: <input name="user"/><br></br>
            Password: <input name="pass"/>
          </label>
          <button onClick={() => navigate("/to_do_list")}>Login</button>
        </div>
      </div>
    );
};