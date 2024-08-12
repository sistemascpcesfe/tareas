import Header from "./Calendar/header.jsx";
import Calendar from "./Calendar/calendar.jsx";
import { checkLoginService } from "../../service/sesion/index.js";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from "dayjs";
dayjs.extend(customParseFormat);

const Home = () => {
    const navigate = useNavigate()

    const getSesion = async () => {
        const req = await checkLoginService()
        if (req.Errorid === '92') {
            navigate("/")
        }
    }

    useEffect(() => {
        getSesion()
    }, []);

    return (
        <div className="h-full w-full overflow-x-hidden">
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