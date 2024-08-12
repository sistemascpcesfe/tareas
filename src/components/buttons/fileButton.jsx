import { Button, Popover, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, useDisclosure } from '@chakra-ui/react';
import FileComponent from '../home/Card/fileComponent';
import { useEffect, useState } from 'react';
import { MdAttachFile } from 'react-icons/md';

const FileButton = ({ colorScheme, asunto, id, size }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [dataFile, setDataFile] = useState()

    useEffect(() => {
        setDataFile({ id: id, asunto: asunto })
    }, [])

    return (
        <>
            <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement='left'>
                <PopoverTrigger>
                    <Button variant="ghost" onClick={onOpen}><MdAttachFile size={size} /></Button>
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverHeader>Formulario para agregar archivos</PopoverHeader>
                    <PopoverCloseButton />
                    <PopoverBody>
                        <FileComponent colorScheme={colorScheme} dataFile={dataFile} />
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </>
    );
};

export default FileButton;
