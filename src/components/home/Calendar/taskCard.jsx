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
    Button,
    Text
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { getColorForTaskType } from '../../../utils';
import DeleteButton from '../../buttons/DeleteButton';

const TaskCard = ({ task, today }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    // Descomponer fecha y hora
    const [fechaParte, hora] = task.fechav.split(' ');
    const [dia, mes, anio] = fechaParte.split('/');
    const fechaFormateada = `${anio}-${mes}-${dia}`;
    const fechaHora = `${fechaFormateada} ${hora}`;
    const taskDate = dayjs(fechaHora);

    // Determinar si la tarea es pasada
    const isPast = taskDate.isBefore(today, 'day');
    const bgColor = isPast ? 'gray' : getColorForTaskType(task.tarea);
    const color = isPast ? 'gray' : getColorForTaskType(task.tarea).replace(/-/g, '.');

    // Función para navegar a la vista de detalle
    const navigateToDetail = () => {
        navigate(`/agenda-comunicacion/${task.orden}`);
        setIsOpen(false);
    };

    return (
        <Box
            bg={`${bgColor}.200`}
            borderColor={`${bgColor}.400`}
            className="p-2 w-full rounded-lg shadow-md border mb-2 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
            maxW="100%" // Ajusta el ancho máximo del Box
        >
            <Popover isOpen={isOpen} placement="auto-start">
                <PopoverTrigger>
                    <div>
                        <h3 className="text-sm font-semibold flex justify-between items-center">
                            <Text noOfLines={1} className="w-full" title={task.asunto}>
                                {task.asunto}
                            </Text>
                            <span>{task.afectado ? "+" : null}</span>
                        </h3>
                    </div>
                </PopoverTrigger>
                <PopoverContent borderColor={`${color}.400`}>
                    <PopoverArrow bg={`${color}.400`} />
                    <PopoverHeader fontWeight='semibold' className='w-full flex justify-between'>
                        <h3 className="text-sm font-semibold">{task.asunto}</h3>
                    </PopoverHeader>
                    <PopoverBody>
                        <div className='flex flex-col'>
                            <span>{task.fechav.slice(10, 16) + "hs"}</span>
                            <Text noOfLines={3}>{task.cuerpo}</Text>
                            <div className='flex w-full gap-2 mt-2'>
                                <Button className='w-full' size="md" colorScheme={color} onClick={navigateToDetail}>
                                    Ver detalle
                                </Button>
                                <DeleteButton size={24} id={task.orden} />
                            </div>
                        </div>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </Box>
    );
};

export default TaskCard;
