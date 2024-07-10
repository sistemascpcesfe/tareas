import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const navigate = useNavigate()
    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("sesion");
        localStorage.removeItem("img");
        localStorage.removeItem("number");
        localStorage.removeItem("type");
        localStorage.removeItem("mp");
        localStorage.removeItem("status");
        navigate("/");
    };

    return (
        <Button colorScheme='red' onClick={handleLogout}>Cerrar Sesión</Button>
    );
};

export default LogoutButton;
