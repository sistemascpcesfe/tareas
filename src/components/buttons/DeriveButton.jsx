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
import FormDeriveComponent from '../home/formDerive';

const DeriveButton = ({task}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <Button onClick={onOpen}>Derivar tarea</Button>
            <Modal isOpen={isOpen} onClose={onClose} size='6xl'>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Formulario para derivar la tarea</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormDeriveComponent task={task}/>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
};

export default DeriveButton;
