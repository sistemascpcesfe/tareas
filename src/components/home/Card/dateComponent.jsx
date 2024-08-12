import { Button, Popover, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, useDisclosure, useToast } from "@chakra-ui/react";
import dayjs from "dayjs";
import { createTaskService } from "../../../service/tarea";
import { useState } from "react";
import { BiCheck } from "react-icons/bi";
import { useLoadingStatus } from "../../../provider/loadingStatusProvider";

const DateComponent = ({ task }) => {
    const { onOpen, onClose, isOpen } = useDisclosure();
    const { setIsStatus, isStatus } = useLoadingStatus();
    const [selectedDateTime, setSelectedDateTime] = useState('');
    const toast = useToast();

    const formatDateNow = (date) => {
        return dayjs(date).format('DD/MM/YYYY HH:mm:ss');
    };

    const handleConfirm = async () => {
        const formattedDate = dayjs(selectedDateTime).format('DD/MM/YYYY HH:mm:ss');
        try {
            const req = await createTaskService({
                Tag: task.tag,
                Tarea: task.tarea,
                Taread: task.taread,
                Orden: task.orden,
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
                    title: `Fecha actualizada correctamente`,
                    status: "success",
                    isClosable: true,
                });
                setIsStatus(!isStatus)
            } else {
                toast({
                    title: `Error al actualizar la fecha ${req.Errornombre}`,
                    status: "error",
                    isClosable: true,
                });
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
        onClose();
    };

    return (
        <>
            <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement='bottom'>
                <PopoverTrigger>
                    <Button variant="ghost">{task?.fechav ? task.fechav.slice(0, 16) : ""}</Button>
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverHeader>Selecciona una fecha</PopoverHeader>
                    <PopoverCloseButton />
                    <PopoverBody className='flex flex-col w-full gap-2'>
                        <div className='flex w-full gap-2'>
                            <input
                                type='datetime-local'
                                value={selectedDateTime}
                                onChange={(e) => setSelectedDateTime(e.target.value)}
                                className='w-full border rounded px-2'
                            />
                            <Button onClick={handleConfirm} size="sm"><BiCheck size={24} /></Button>
                        </div>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </>
    )
}

export default DateComponent;