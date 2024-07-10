import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import FileComponent from '../home/fileComponent';
import { useEffect, useState } from 'react';

const FileButton = ({ colorScheme, asunto, id }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [dataFile , setDataFile] = useState()

    useEffect(() => {
        setDataFile({id: id, asunto: asunto})
    },[])

    return (
        <>
            <Button colorScheme={colorScheme} onClick={onOpen}>Agregar archivos</Button>
            <Modal isOpen={isOpen} onClose={onClose} size='xl'>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Formulario para agregar archivos</ModalHeader>
                    <ModalCloseButton />
                        <ModalBody>
                            <FileComponent colorScheme={colorScheme} dataFile={dataFile}/>
                        </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default FileButton;
