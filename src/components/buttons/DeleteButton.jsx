import { Button } from '@chakra-ui/react';
import { stateTaskService } from '../../service/tarea';

const DeleteButton = ({id}) => {

    const onclick = async () => {
        try {
            const req = await stateTaskService(id, 1)
            console.log(req)
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <Button onClick={() => onclick()} colorScheme='red'>Eliminar</Button>
    );
};

export default DeleteButton;
