import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { checkTaskService, getTaskForOrder } from '../../../service/tarea';
import { getColorForTags } from '../../../utils';
import { useLoadingStatus } from '../../../provider/loadingStatusProvider';
import DetailComponente from './detailComponent';
import { Button, Tooltip, Spinner } from '@chakra-ui/react';
import { BsArrowLeft } from 'react-icons/bs';
import LogoutButton from '../../buttons/LogoutButton';
import DateComponent from './dateComponent';

const TaskDetails = () => {
    const navigate = useNavigate();
    const { isStatus } = useLoadingStatus();
    const { taskId: orden } = useParams();

    const [tasks, setTasks] = useState([]);
    const [firstTask, setFirstTask] = useState()
    const [isLoadingTask, setIsLoadingTask] = useState(true);
    const [color, setColor] = useState();

    const getOneTask = useCallback(async (orden) => {
        try {
            setIsLoadingTask(true);
            const user = localStorage.getItem("user");
            const sesion = localStorage.getItem("sesion");
            if (!user || !sesion) {
                navigate("/");
                return;
            }

            const req = await checkTaskService("", "", "", "", "", "", "", orden, "");
            const fetchedTasks = req.items;
            setTasks(fetchedTasks);
            setFirstTask(fetchedTasks[0])

            if (fetchedTasks[0].afectado === "SI") {
                await getTaskByOrden(fetchedTasks[0].orden);
            }

            const taskColor = getColorForTags(fetchedTasks[0].tarea);
            setColor(taskColor);
            setIsLoadingTask(false);
        } catch (error) {
            console.error('Error al cargar los detalles de la tarea:', error);
            setIsLoadingTask(false);
        }
    }, [navigate]);

    const getTaskByOrden = useCallback(async (orden) => {
        try {
            const req = await getTaskForOrder(orden);
            const newTask = req.items[0];
            if (newTask) {
                setTasks((prevTasks) => {
                    const taskExists = prevTasks.some(task => task.orden === newTask.orden);
                    if (!taskExists) {
                        return [...prevTasks, newTask];
                    }
                    return prevTasks;
                });
                await getTaskByOrden(newTask.orden);
            }
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        getOneTask(orden);
    }, [orden, isStatus]);

    return (
        <div className="w-screen h-screen flex flex-col overflow-x-hidden">
            <header className="w-full h-16 bg-white flex justify-between items-center border-b px-6 fixed top-0 z-50">
                <DateComponent task={firstTask} />
                <div className='flex gap-4'>
                    <Tooltip hasArrow placement='bottom' label="Volver">
                        <Button colorScheme='gray' onClick={() => navigate("/agenda-comunicacion")}>
                            <BsArrowLeft size={24} />
                        </Button>
                    </Tooltip>
                    <LogoutButton />
                </div>
            </header>

            <main className="p-4 mt-16 w-full overflow-y-auto">
                {isLoadingTask ? (
                    <div className='flex justify-center'>
                        <Spinner />
                    </div>
                ) : (
                    <>
                        {tasks.map((task, index) => (
                            <DetailComponente
                                key={index}
                                color={color}
                                task={task}
                                isLoadingTask={isLoadingTask}
                                isDefaultOpen={index === tasks.length - 1}
                            />
                        ))}
                    </>
                )}
            </main>
        </div>
    );
};

export default TaskDetails;
