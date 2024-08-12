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
import FormDeriveComponent from '../home/Card/formDerive';
import { BsArrowRight } from 'react-icons/bs';

const DeriveButton = ({ colorScheme, task, size }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <Button variant="ghost" onClick={onOpen}>
                <BsArrowRight size={size} />
            </Button>
            <Modal isOpen={isOpen} onClose={onClose} size='6xl'>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Formulario para derivar la tarea</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormDeriveComponent colorScheme={colorScheme} task={task} />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
};

export default DeriveButton;
