import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    Tooltip
} from '@chakra-ui/react'
import FormComponent from '../home/form';
import { BsPlus } from 'react-icons/bs';

const CreateTask = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <Tooltip hasArrow placement='bottom' label="Crear tarea">
                <Button onClick={onOpen} variant='outline'><BsPlus size={24} /></Button>
            </Tooltip>
            <Modal isOpen={isOpen} onClose={onClose} size='6xl'>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Formulario para la nueva tarea</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormComponent />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
};

export default CreateTask;
