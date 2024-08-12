import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { checkTaskService, statusTasksService, tagService, typesTasksService, usersService } from '../service/tarea';

dayjs.locale('es'); // Establecer locale en español

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [task, setTask] = useState([]);
    const [filters, setFilters] = useState({
        dateStart: "",
        dateEnd: "",
        tags: "",
        types: "",
        users: "",
        status: "" // Asigna el estado por defecto
    });
    const [filterOptions, setFilterOptions] = useState({ tags: [], users: [], types: [], status: [] });

    const getFilters = useCallback(async () => {
        try {
            const tags = await tagService();
            const users = await usersService();
            const types = await typesTasksService();
            const status = await statusTasksService();
            setFilterOptions({ tags: tags.tags, users: users.items, types: types.items, status: status.items });
        } catch (error) {
            console.log(error);
        }
    }, []);

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
                "0"
            );
            setTask(req.items);
        } catch (error) {
            console.log(error);
        }
    }, []);

    const triggerUpdate = () => {
        getTask(filters);
    }

    useEffect(() => {
        getFilters();
    }, [getFilters]);

    useEffect(() => {
        getTask(filters);
    }, [filters, getTask]);

    return (
        <TaskContext.Provider value={{ task, filters, filterOptions, setFilters, triggerUpdate }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTask = () => {
    return useContext(TaskContext);
};
