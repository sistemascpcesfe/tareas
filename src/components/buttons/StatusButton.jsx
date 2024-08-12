import { Box, Button, Popover, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Select, useDisclosure, useToast } from '@chakra-ui/react';
import { stateTaskService, statusTasksService } from '../../service/tarea';
import { useEffect, useState } from 'react';
import { useLoadingStatus } from '../../provider/loadingStatusProvider';
import { MdOutlineSwapVert } from 'react-icons/md';

const StatusButton = ({ colorScheme, id, size }) => {
    const toast = useToast()
    const { isStatus, setIsStatus } = useLoadingStatus()
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [status, setStatus] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('');

    useEffect(() => {
        const getStatus = async () => {
            try {
                const req = await statusTasksService();
                setStatus(req.items);
            } catch (error) {
                console.error('Error al obtener los estados:', error);
            }
        };

        getStatus();
    }, [id]);

    const handleSelectChange = (event) => {
        setSelectedStatus(event.target.value);
    };

    const handleStatusChange = async () => {
        try {
            const statusChange = await stateTaskService(id, selectedStatus);
            setIsStatus(!isStatus)
            if (statusChange.Errorid === "00") {
                toast({
                    title: 'Estado cambiado.',
                    description: `El estado de la tarea ${id} se cambio correctamente`,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                })
                onClose();
            } else {
                toast({
                    title: 'Error.',
                    description: `Error al cambiar el estado de la tarea ${id}, ${statusChange.Errornombre}`,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
                onClose();
            }

        } catch (error) {
            console.error('Error al cambiar el estado:', error);
        }
    };

    return (
        <>
            <Popover isOpen={isOpen} onClose={onClose} size='xl' placement='left'>
                <PopoverTrigger>
                    <Button variant="ghost" onClick={onOpen}>
                        <MdOutlineSwapVert size={size} />
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverHeader>Selecciona el estado de la tarea</PopoverHeader>
                    <PopoverCloseButton />
                    <PopoverBody className='flex items-center justify-center gap-2'>
                        <Select
                            name='status'
                            onChange={handleSelectChange}
                            value={selectedStatus}
                            placeholder='Estados'
                        >
                            {status.map((status) => (
                                <option key={status.codigo} value={status.codigo}>
                                    {status.codigod}
                                </option>
                            ))}
                        </Select>
                        <Box mb={4}>
                            <Button colorScheme={colorScheme} onClick={handleStatusChange} mt={4}>
                                Confirmar
                            </Button>
                        </Box>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </>
    );
};

export default StatusButton;
