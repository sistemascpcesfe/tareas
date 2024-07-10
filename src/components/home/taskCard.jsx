import { useState } from 'react';
import dayjs from 'dayjs';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    Box,
    Button
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { getColorForTaskType } from '../../utils';

const TaskCard = ({ task, today }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const navigateToDetail = () => {
        navigate(`/agenda-comunicacion/${task.orden}`);
        setIsOpen(false);
    };

    const [fechaParte, hora] = task.fechav.split(' ');
    const [dia, mes, anio] = fechaParte.split('/');
    const fechaFormateada = `${anio}-${mes}-${dia}`;
    const fechaHora = `${fechaFormateada} ${hora}`;
    const taskDate = dayjs(fechaHora).format('YYYY-MM-DD');

    const isPast = dayjs(taskDate).isBefore(today, 'day');
    const bgColor = isPast ? 'gray' : getColorForTaskType(task.tarea);
    const color = isPast ? 'gray' : getColorForTaskType(task.tarea).replace(/-/g, '.');

    return (
        <Box
            bg={`${bgColor}.200`}
            borderColor={`${bgColor}.400`}
            className="p-2 w-full rounded-lg shadow-md border mb-2 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
        >
            <Popover isOpen={isOpen} placement="auto-start">
                <PopoverTrigger>
                    <div>
                        <h3 className="text-sm font-semibold">{task.asunto}</h3>
                    </div>
                </PopoverTrigger>
                <PopoverContent borderColor={`${color}.400`}>
                    <PopoverArrow bg={`${color}.400`} />
                    <PopoverHeader fontWeight='semibold'>{task.asunto}</PopoverHeader>
                    <PopoverBody>
                        <div className='flex flex-col'>
                            <span>{task.fechav.slice(10, 16) + "hs"}</span>
                            <span>{task.cuerpo}</span>
                            <Button mt={2} size="md" colorScheme={color} onClick={navigateToDetail}>
                                Ver detalle
                            </Button>
                        </div>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </Box>
    );
};

export default TaskCard;
