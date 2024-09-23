import { Button } from '@chakra-ui/react';
import { deleteTaskService } from '../../service/tarea';
import { MdDelete } from 'react-icons/md';
import { useTask } from '../../provider/taskProvider';
import { useNavigate } from 'react-router-dom';

const DeleteButton = ({ size, id, isInCard }) => {
    const { triggerUpdate } = useTask()
    const navigate = useNavigate()
    const req = async (tarea) => {
        const usuario = localStorage.getItem("user");
        const sesion = localStorage.getItem("sesion");
        const service = await deleteTaskService({ usuario, sesion, tarea });
        triggerUpdate()
        if (isInCard) {
            navigate("/agenda-comunicacion")
        }
        console.log(service);
    };

    return (
        <Button colorScheme='red' onClick={() => req(id)}>
            <MdDelete size={size} />
        </Button>
    );
};

export default DeleteButton;
