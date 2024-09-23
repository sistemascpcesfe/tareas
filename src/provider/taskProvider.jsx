import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { checkTaskService, statusTasksService, tagService, typesTasksService, usersService } from '../service/tarea';

dayjs.locale('es'); // Establecer locale en español

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [task, setTask] = useState([]);
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        dateStart: "",
        dateEnd: "",
        tags: "",
        types: "",
        users: "",
        status: "" // Asigna el estado por defecto
    });
    const [filterOptions, setFilterOptions] = useState({ tags: [], users: [], types: [], status: [] });

    const isMounted = useRef(false); // Para controlar el primer montaje

    // Función para obtener los filtros disponibles (tags, users, etc.)
    const getFilters = useCallback(async () => {
        try {
            setLoading(true)
            const tags = await tagService();
            const users = await usersService();
            const types = await typesTasksService();
            const status = await statusTasksService();
            setFilterOptions({ tags: tags.tags, users: users.items, types: types.items, status: status.items });
            setLoading(false)
        } catch (error) {
            console.log(error);
        }
    }, []);

    // Función para obtener las tareas según los filtros
    const getTask = useCallback(async (filters) => {
        try {
            const req = await checkTaskService(
                filters.dateStart,
                filters.dateEnd,
                filters.tags,
                filters.types,
                filters.users,
                filters.status,
                "",
                "",
                "0",
                filters.privado
            );
            setTask(req.items);
        } catch (error) {
            console.log(error);
        }
    }, []);

    // Función para disparar la actualización de tareas
    const triggerUpdate = () => {
        getTask(filters);
    };

    // Se ejecuta una vez cuando el componente se monta para obtener los filtros
    useEffect(() => {
        getFilters();
    }, [getFilters]);

    // Solo ejecuta la consulta de tareas después del primer montaje
    useEffect(() => {
        if (isMounted.current) {
            getTask(filters);
        } else {
            isMounted.current = true; // Evita que se ejecute en el primer renderizado
        }
    }, [filters, getTask]);

    return (
        <TaskContext.Provider value={{ task, loading, filters, filterOptions, setFilters, triggerUpdate }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTask = () => {
    return useContext(TaskContext);
};
