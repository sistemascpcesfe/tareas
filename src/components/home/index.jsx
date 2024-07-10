import Header from "./header.jsx";
import Calendar from "./calendar.jsx";
import { checkLoginService } from "../../service/sesion/index.js";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast,{ Toaster } from "react-hot-toast";

const Home = () => {
    const navigate = useNavigate()

    const getSesion = async () => {
        const req = await checkLoginService()
        if(req.Errorid === '92'){
            toast.error(`${req.Errornombre}`, {position: "bottom-right"})
            navigate("/")
        }
    }

     useEffect(() => {
         getSesion()
     }, []);

    return (
        <div className="h-full w-full overflow-x-hidden">
            <Toaster/>
            <div>
                <Header />
            </div>
            <div>
                <Calendar />
            </div>
        </div>
    );
}

export default Home;