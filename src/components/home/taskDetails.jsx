import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { checkTaskService, getFileService } from '../../service/tarea';
import { Box, Button, Wrap, Spinner, Tag } from '@chakra-ui/react';
import { downloadFile, getColorForTags } from '../../utils';
import RepeatButton from '../buttons/RepeatButton';
import DeleteButton from '../buttons/DeleteButton';
import EditButton from '../buttons/EditButton';
import FileButton from '../buttons/fileButton';
import StatusButton from '../buttons/StatusButton';
import DeriveButton from '../buttons/DeriveButton';
import { useLoadingFile } from '../../provider/loadingFileProvider';
import { useLoadingStatus } from '../../provider/loadingStatusProvider';

const TaskDetails = () => {
    const navigate = useNavigate();
    const { isFile, setIsFile } = useLoadingFile()
    const { isStatus, setIsStatus } = useLoadingStatus()
    const { taskId: orden } = useParams();
    const [files, setFiles] = useState([]);
    const [isLoadingTask, setIsLoadingTask] = useState(true);
    const [isLoadingFiles, setIsLoadingFiles] = useState(true);
    const [color, setColor] = useState();
    const [task, setTask] = useState();

    const getOneTask = async () => {
        try {
            setIsLoadingTask(true);
            const req = await checkTaskService("", "", "", "", "", "", "", orden);
            const fetchedTask = req.items[0];
            setTask(fetchedTask);
            const taskColor = getColorForTags(fetchedTask.tarea);
            setColor(taskColor);
            setIsLoadingTask(false);
            await getFiles();
        } catch (error) {
            console.error('Error al cargar los detalles de la tarea:', error);
            setIsLoadingTask(false);
        }
    };

    const getFiles = async () => {
        try {
            setIsLoadingFiles(true);
            const filesResponse = await getFileService({ Tarea: orden });
            console.log(filesResponse)
            setFiles(filesResponse.items);
            setIsLoadingFiles(false);
        } catch (error) {
            console.error('Error al cargar los archivos de la tarea:', error);
            setIsLoadingFiles(false);
        }
    };

    useEffect(() => {
        setIsStatus(false)
        getOneTask();

    }, [orden, isStatus]);

    useEffect(() => {
        if (isFile) {
            setIsFile(false)
            getFiles()
        }
    }, [isFile])

    if (isLoadingTask) {
        return (
            <div className='flex justify-center items-center w-screen h-screen bg-gray-200'>
                <Spinner
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size='xl'
                />
            </div>
        );
    }

    const handleDownload = (file) => {
        const cuerpo = file.cuerpo;
        const nombreArchivoConExtension = file.archivo;
        downloadFile(cuerpo, nombreArchivoConExtension);
    };

    const tagsArray = task?.tag ? task.tag.split(',') : [];
    const usersArray = task?.afecta ? task.afecta.split(',') : [];

    return (
        <div className='w-full h-screen bg-gray-200'>
            <div className='pb-8'></div>
            <div className="container mx-8 bg-white rounded-lg shadow-lg">
                <Box bg={`${color}.200`} className="h-3 rounded-t-lg"></Box>
                <div className="p-4">
                    <div className='flex w-full justify-between'>
                        <h1 className="text-2xl font-bold mb-4">Detalles de la Tarea ID: {orden}</h1>
                        <h4 className="mb-4">{task.estado} - {task.estadod ? task.estadod : "Sin estado"}</h4>
                    </div>
                    <div className="p-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 sm:col-span-1">
                                <div className='py-2'>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tarea:</label>
                                    <span>{task.taread}</span>
                                </div>
                                <div className='py-2'>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Asunto:</label>
                                    <span>{task.asunto}</span>
                                </div>
                                <div className='py-2'>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags:</label>
                                    <div>
                                        {tagsArray.map((tag, index) => (
                                            <Tag key={index} colorScheme={color} className="mr-2 mb-2">{tag.trim()}</Tag>
                                        ))}
                                    </div>
                                </div>
                                <div className='py-2'>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cuerpo:</label>
                                    <span>{task?.cuerpo}</span>
                                </div>
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <div className='py-2'>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y Hora:</label>
                                    <span>{`${task.fechav ? task.fechav.slice(0, 16) : ""}`}</span>
                                </div>
                                <div className='py-2'>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Usuario:</label>
                                    <span>{`${task.usuario ? task.usuario : ""}`}</span>
                                </div>
                                <div className='py-2'>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Afecta:</label>
                                    <div>
                                        {usersArray.map((user, index) => (
                                            <Tag key={index} colorScheme={color} className="mr-2 mb-2">{user.trim()}</Tag>
                                        ))}
                                    </div>
                                </div>
                                <div className='py-2'>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Alcance:</label>
                                    <span>{`${task.alcance ? task.alcance : ""}`}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mostrar archivos adjuntos */}
                    {isLoadingFiles ? (
                        <div className="mt-8 flex gap-2">
                            <Spinner
                                thickness='4px'
                                speed='0.65s'
                                emptyColor='gray.200'
                                color='blue.500'
                                size='md'
                            />
                            <h2>Comprobando archivos adjuntos...</h2>
                        </div>
                    ) : (
                        files.length > 0 && (
                            <div className="mt-8">
                                <h2 className="text-lg font-semibold mb-4">Archivos Adjuntos:</h2>
                                <Box className='flex flex-wrap gap-2'>
                                    {files.map((file, index) => (
                                        <div key={index}>
                                            <Button
                                                size="sm"
                                                colorScheme={color}
                                                onClick={() => handleDownload(file)}
                                                className="mr-2"
                                            >
                                                {file?.archivo.length > 35
                                                    ? file?.archivo.substring(0, 35) + "..."
                                                    : file?.archivo}
                                            </Button>
                                        </div>
                                    ))}
                                </Box>
                            </div>
                        )
                    )}

                    <div className='w-full flex justify-end items-center'>
                        <Wrap spacing={4} className="mt-8">
                            <Button colorScheme='gray' onClick={() => navigate("/agenda-comunicacion")}>Volver</Button>
                            <DeriveButton task={task} />
                            <FileButton colorScheme={color} asunto={task.asunto} id={orden} />
                            <RepeatButton colorScheme={color} id={orden} task={task} />
                            <StatusButton colorScheme={color} id={orden} />
                            <EditButton colorScheme={color} task={task}>Editar</EditButton>
                            <DeleteButton id={orden} />
                        </Wrap>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetails;
