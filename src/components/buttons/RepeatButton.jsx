import { useState } from 'react';
import dayjs from 'dayjs';
import { Button, Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverCloseButton, PopoverBody, useDisclosure, useToast } from '@chakra-ui/react';
import { CiRepeat } from 'react-icons/ci';
import { FiPlus, FiX } from 'react-icons/fi';
import { createTaskService, uploadFileService } from '../../service/tarea';

const RepeatButton = ({ colorScheme, task, files, isLoadingFiles, size }) => {
    const { onOpen, onClose, isOpen } = useDisclosure();
    const [datesTimes, setDatesTimes] = useState([]);
    const [selectedDateTime, setSelectedDateTime] = useState('');
    const toast = useToast();

    const handleAddDateTime = () => {
        if (selectedDateTime) {
            setDatesTimes([...datesTimes, selectedDateTime]);
            setSelectedDateTime('');
        }
    };

    const handleDeleteDateTime = (index) => {
        const newDatesTimes = datesTimes.filter((_, i) => i !== index);
        setDatesTimes(newDatesTimes);
    };

    const formatDateNow = (date) => {
        return dayjs(date).format('DD/MM/YYYY HH:mm:ss');
    };

    const handleConfirm = async () => {
        toast({
            title: "Creando tarea...",
            status: "info",
            isClosable: true,
        });

        toast({
            title: "Agregando archivos si existen...",
            status: "info",
            isClosable: true,
        });

        for (const date of datesTimes) {
            const formattedDate = dayjs(date).format('DD/MM/YYYY HH:mm:ss');
            try {
                const req = await createTaskService({
                    Tag: task.tag,
                    Tarea: task.tarea,
                    Asunto: task.asunto,
                    Fechav: formattedDate,
                    Alcance: task.alcance,
                    Usuario: task.usuario,
                    Cuerpo: task.cuerpo,
                    Afecta: task.afecta,
                    Fecha: formatDateNow(new Date())
                });
                if (req.Errorid == "00") {
                    toast({
                        title: `Tarea creada exitosamente para la fecha ${formattedDate}`,
                        status: "success",
                        isClosable: true,
                    });
                } else {
                    toast({
                        title: `Error al crear la tarea para la fecha ${formattedDate}`,
                        status: "error",
                        isClosable: true,
                    });
                }
                for (const file of files) {
                    const fileData = {
                        Tarea: req.id,
                        Asunto: task.asunto,
                        Archivo: file.archivo,
                        Cuerpo: file.cuerpo
                    };
                    const reqFile = await uploadFileService(fileData);
                    if (reqFile.Errorid === "0") {
                        toast({
                            title: `Archivo adjuntado correctamente, identificador archivo: ${reqFile.id}`,
                            status: "success",

                            isClosable: true,
                        });
                    }
                }
            } catch (error) {
                console.error('Error creating task:', error);
                toast({
                    title: "Error al crear tarea",
                    description: error.message,
                    status: "error",
                    isClosable: true,
                });
            }
        }
        onClose();
    };

    return (
        <>
            <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement='left'>
                <PopoverTrigger>
                    <Button variant="ghost"><CiRepeat size={size} /></Button>
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverHeader>Formulario para repetir la tarea</PopoverHeader>
                    <PopoverCloseButton />
                    {isLoadingFiles ? (
                        <div className='px-2 py-2'>Cargando archivos...</div>
                    ) : (
                        <PopoverBody className='flex flex-col w-full gap-2'>
                            <div className='flex w-full gap-2'>
                                <input
                                    type='datetime-local'
                                    value={selectedDateTime}
                                    onChange={(e) => setSelectedDateTime(e.target.value)}
                                    className='w-full border rounded px-2'
                                />
                                <Button onClick={handleAddDateTime} size="sm"><FiPlus size={24} /></Button>
                            </div>
                            <div className='w-full'>
                                <ul>
                                    {datesTimes.map((dt, index) => (
                                        <li key={index} className='flex justify-between items-center pb-2'>
                                            <span>{dayjs(dt).format('DD/MM/YYYY HH:mm')}</span>
                                            <Button onClick={() => handleDeleteDateTime(index)} size="sm" colorScheme='red'><FiX size={18} /></Button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <Button colorScheme={colorScheme} onClick={handleConfirm}>Confirmar</Button>
                        </PopoverBody>
                    )}
                </PopoverContent>
            </Popover>
        </>
    );
};

export default RepeatButton;
