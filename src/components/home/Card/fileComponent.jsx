import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Box,
    Button,
    Spinner,
    useToast,
    Text
} from '@chakra-ui/react';
import { useState } from 'react';
import { uploadFileService } from '../../../service/tarea';
import { BsArrowUp } from 'react-icons/bs';
import { FiX } from 'react-icons/fi';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const FileComponent = ({ dataFile, colorScheme }) => {
    const toast = useToast()
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    const handleFileChange = async (e) => {
        const selectedFiles = Array.from(e.target.files);
        let base64Files = [];

        for (let file of selectedFiles) {
            if (file.size > MAX_FILE_SIZE) {
                setErrorMessage(`El archivo ${file.name} supera el tamaño máximo de 5 MB`);
                continue;
            }
            setErrorMessage('');
            const base64 = await convertToBase64(file);
            base64Files.push({ file: file.name, base64 });
        }

        setFiles([...files, ...base64Files]);
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleRemoveFile = (file) => {
        const updatedFiles = files.filter((f) => f !== file);
        setFiles(updatedFiles);
    };

    const handleSubmit = async (file) => {
        setUploading((prev) => ({ ...prev, [file.file]: true }));
        try {
            const fileData = {
                Tarea: dataFile.id,
                Asunto: dataFile.asunto,
                Archivo: file.file,
                Cuerpo: file.base64
            };
            const req = await uploadFileService(fileData);
            if (req.Errorid === "0") {
                toast({
                    title: "Se cargo correctamente el archivo",
                    description: `El archivo: ${file.file} se cargo correctamente a la tarea: ${dataFile.id}`,
                    status: "success",
                    isClosable: true,
                });
            } else {
                toast({
                    title: "Error al cargar el archivo",
                    description: `${req.Errornombre}`,
                    status: "error",
                    isClosable: true,
                });
            }
            if (req.Errornombre) {
                setFiles((prev) => prev.filter((f) => f !== file));
            }
        } catch (error) {
            console.log('Error al subir archivos:', error);
        } finally {
            setUploading((prev) => ({ ...prev, [file.file]: false }));
        }
    };

    return (
        <Box>
            <FormControl isInvalid={!!errorMessage}>
                <FormLabel>Archivos Adjuntos</FormLabel>
                <Input
                    type='file'
                    size='xl'
                    onChange={handleFileChange}
                    accept='.jpeg, .jpg, .png, .pdf, .mp4'
                    multiple
                />
                {errorMessage && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
            </FormControl>

            <div className='flex flex-col w-full'>
                {files.map((file, index) => (
                    <Box key={index} display='flex' alignItems='center' justifyContent='space-between' mt={2}>
                        <span>
                            <label>{file.file}</label>
                        </span>
                        {uploading[file.file] ? (
                            <Spinner size='sm' />
                        ) : (
                            <span className='flex gap-2'>
                                <Button size='sm' colorScheme={colorScheme} onClick={() => handleRemoveFile(file)}><FiX size={18} /></Button>
                                <Button size='sm' colorScheme={colorScheme}
                                    onClick={() => handleSubmit(file)}
                                >
                                    <BsArrowUp size={18} />
                                </Button>
                            </span>
                        )}
                    </Box>
                ))}
                <Text color={`${colorScheme}.400`} className='my-2 text-md font-semibold text-center'>Una vez cargados todos los archivos actualice la página</Text>
            </div>
        </Box>
    );
};

export default FileComponent;
