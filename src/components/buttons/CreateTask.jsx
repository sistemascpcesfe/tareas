import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure
} from '@chakra-ui/react'
import FormComponent from '../home/form';

const CreateTask = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <Button onClick={onOpen}>Crear tarea</Button>
            <Modal isOpen={isOpen} onClose={onClose} size='6xl'>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Formulario para la nueva tarea</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormComponent/>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
};

export default CreateTask;
