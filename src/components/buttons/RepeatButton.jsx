import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';

const RepeatButton = ({ colorScheme, task }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const repeatTask = () => {
        console.log(task)
    }
    
    return (
        <>
        <Button colorScheme={colorScheme} onClick={onOpen}>Repetir tarea</Button>
            <Modal isOpen={isOpen} onClose={onClose} size='xl'>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Formulario para repetir la tarea</ModalHeader>
                    <ModalCloseButton
                     />
                    <ModalBody className='flex items-center justify-center gap-2'>
                        <Button onClick={() => repeatTask()}>Confirmar</Button>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default RepeatButton;
