import {useState, useEffect} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import "./LoginScreen.css";

const LoginScreen = ({history}) =>{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    
    useEffect(() =>{
        if(localStorage.getItem("authToken")){
            history.push("/");
        }
    }, [history]);

    const loginHandler = async (e) =>{
        e.preventDefault();

        const config = {
            header:{
                "Content-Type" : "aplication/json"
            }
        } 

        try {
            const {data} = await axios.post("/api/auth/login", { email, password},config);
            localStorage.setItem("authToken", data.token);
            history.push("/");
        } catch (error) {
            setError(error.response.data.error);
            setTimeout(() =>{
                setError("");
            }, 5000)
        }
    }

    return(
        <div className="login-screen">
         <form onSubmit={loginHandler} className="login-screen__form">
            <h3 className="login-screen__title">LogIn</h3>
            {error && <span className="error-message">{error}</span>}

            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" required id="email" placeholder="Enter your email"
                value={email} onChange={(e)=> setEmail(e.target.value)}/>
            </div>

            <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" required id="password" placeholder="Enter your password"
            value={password} onChange={(e)=> setPassword(e.target.value)}/>
        </div>

            <button type="submit" className="btn btn-primary">LogIn</button>
            <span className="login-screen__subtext">Don't have acount? <Link to="/register">Register</Link></span>
            </form>
        </div>
    )
}

export default LoginScreen;