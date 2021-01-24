import {useState, useEffect} from 'react';
import axios from 'axios';

const PrivateScreen = ({history}) =>{
    const [error, setError] = useState("");
    const [privateData, setPrivateData] = useState("");

    useEffect(() =>{
        if(!localStorage.getItem("authToken")){
            history.push("/login");
        }
        const fetchprivateData = async () =>{
            const config ={
                headers:{
                    "Content-Type" : "aplication/json",
                    Autorization: `Beare ${localStorage.getItem("authToken")}`
                }
            }
            try {
                const {data} = await axios.get("api/private", config);
                setPrivateData(data.data)
            } catch (error) {
                localStorage.removeItem("authToken");
                setError("You are not authorized, please Login");
            }
        }
       fetchprivateData();
    }, [history]);

    const logoutHandler = () =>{
        localStorage.removeItem("authToken");
        history.push("/login");
    };

    return error? (
        <span className="error-message">{error}</span>
    ) : (
            <>
                <div style={{background: "green", color:"withe"}}>{privateData}</div>
                <button onClick={logoutHandler}>LogOut</button>
             </>
        );
};
export default PrivateScreen;