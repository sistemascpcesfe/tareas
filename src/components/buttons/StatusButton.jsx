import { Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Select, useDisclosure } from '@chakra-ui/react';
import { stateTaskService, statusTasksService } from '../../service/tarea';
import { useEffect, useState } from 'react';
import { useLoadingStatus } from '../../provider/loadingStatusProvider';

const StatusButton = ({ colorScheme, id }) => {
    const { setIsStatus } = useLoadingStatus()
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
            await stateTaskService(id, selectedStatus);
            setIsStatus(true)
            onClose();
        } catch (error) {
            console.error('Error al cambiar el estado:', error);
        }
    };

    return (
        <>
            <Button colorScheme={colorScheme} onClick={onOpen}>Cambiar de estado</Button>
            <Modal isOpen={isOpen} onClose={onClose} size='xl'>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Formulario para cambiar el estado de la tarea</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody className='flex items-center justify-center gap-2'>
                        <Select
                            name='status'
                            onChange={handleSelectChange}
                            value={selectedStatus}
                            placeholder='Seleccione un estado'
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
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default StatusButton;
