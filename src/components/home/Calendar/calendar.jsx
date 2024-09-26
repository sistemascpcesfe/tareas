import { useEffect, useRef, useState } from "react";
import { useDate } from "../../../provider/dateProvider";
import { createTaskService } from "../../../service/tarea";
import TaskCard from "./taskCard";
import dayjs from "dayjs";
import { useTask } from "../../../provider/taskProvider";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Calendar = () => {
    const { currentDate, today } = useDate();
    const navigate = useNavigate()
    const toast = useToast()
    const { task, setFilters, triggerUpdate } = useTask();
    const [dropIndicator, setDropIndicator] = useState(null);
    const [dataUser, setDataUser] = useState({})
    const parentRef = useRef();

    useEffect(() => {
        const user = localStorage.getItem("user")
        const sesion = localStorage.getItem("sesion")
        if (!user || !sesion) {
            navigate("/")
        }
        setDataUser({ user, sesion });
        const startOfMonth = currentDate.startOf("month").format("DD/MM/YYYY");
        const endOfMonth = currentDate.endOf("month").format("DD/MM/YYYY");
        setFilters({ dateStart: startOfMonth, dateEnd: endOfMonth });
    }, [currentDate]);

    const startOfMonthDate = currentDate.startOf("month");
    const startDayOfWeek = startOfMonthDate.day();
    const daysInMonth = currentDate.daysInMonth();

    const handleDragStart = (event, task) => {
        event.dataTransfer.setData("task", JSON.stringify(task));
        event.dataTransfer.setDragImage(new Image(), 0, 0);
    };

    const handleDragOver = (event, date) => {
        event.preventDefault();
        if (!dropIndicator || dropIndicator !== date) {
            setDropIndicator(date);
        }
    };

    const handleDragEnter = (event, date) => {
        event.preventDefault();
        if (!dropIndicator || dropIndicator !== date) {
            setDropIndicator(date);
        }
    };

    const handleDragLeave = () => {
        setDropIndicator(null);
    };

    const handleDrop = async (event, date) => {
        event.preventDefault();
        const task = JSON.parse(event.dataTransfer.getData("task"));
        const formattedDate = dayjs(date, "YYYY-MM-DD").format("DD/MM/YYYY");
        const fechaHora = `${formattedDate} ${task.fechav.slice(11, 20)}`;
        const updatedTask = { ...task, nuevaFecha: fechaHora };

        try {
            const res = await createTaskService({
                Orden: updatedTask.orden,
                Cuerpo: updatedTask.cuerpo,
                Tag: updatedTask.tag,
                Tarea: updatedTask.tarea,
                Taread: updatedTask.taread,
                Asunto: updatedTask.asunto,
                Fecha: updatedTask.fecha,
                Fechav: updatedTask.nuevaFecha,
                Alcance: updatedTask.alcance,
                Afecta: updatedTask.afecta,
                Privado: updatedTask.privado
            });
            if (res.Errorid === "00") {
                toast({
                    title: 'Tarea actualizada correctamente',
                    description: `Se actualizo correctamente la tarea`,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                })
            } else {
                toast({
                    title: 'No se actualizo la tarea',
                    description: `Hubo un error tratando de actualizar la tarea. ${res.Errornombre}`,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
            }
            triggerUpdate()
        } catch (error) {
            console.error("Error actualizando la tarea:", error);
        } finally {
            setDropIndicator(null);
        }
    };

    const generateCalendarCells = () => {
        const cells = [];

        for (let i = 0; i < startDayOfWeek; i++) {
            cells.push(
                <div
                    key={`empty-start-${i}`}
                    className="flex-1 min-h-[200px] border-t border-gray-200"
                ></div>
            );
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = currentDate.date(day).format("YYYY-MM-DD");
            const isToday = today.isSame(currentDate.date(day), "day");
            const dayTasks = task ? filterAndSortTasks(task, date) : [];
            const bgColor = isToday ? "bg-yellow-100" : "";

            cells.push(
                <div
                    key={`day-${day}`}
                    className={`flex-1 min-h-[200px] flex flex-col border-t items-start justify-start p-2 relative ${bgColor}`}
                    onDrop={(event) => handleDrop(event, date)}
                    onDragOver={(event) => handleDragOver(event, date)}
                    onDragEnter={(event) => handleDragEnter(event, date)}
                    onDragLeave={handleDragLeave}
                >
                    <div className={`text-lg font-semibold`}>{day}</div>
                    <div className="w-full">
                        {dayTasks.map((task) => (
                            <div
                                key={task.orden}
                                draggable
                                onDragStart={(event) => handleDragStart(event, task)}
                                className="cursor-move"
                            >
                                <TaskCard task={task} today={today} user={dataUser} />
                            </div>
                        ))}
                        {dropIndicator === date ? (<div className="w-full h-1 bg-blue-200 rounded-full block"></div>) : null}
                    </div>
                </div>

            );
        }

        const totalCells = startDayOfWeek + daysInMonth;
        const remainingEmptyCells =
            totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);

        for (let i = 0; i < remainingEmptyCells; i++) {
            cells.push(
                <div
                    key={`empty-end-${i}`}
                    className="flex-1 min-h-[200px]"
                ></div>
            );
        }

        return cells;
    };

    const filterAndSortTasks = (tasks, date) => {
        const filteredTasks = tasks.filter((task) => {
            // Verifica si task.fechav existe y no está vacío
            if (!task.fechav || typeof task.fechav !== 'string' || !task.fechav.includes(' ')) {
                return false; // Excluye tareas que no cumplen con el formato esperado
            }

            // Divide la cadena en fecha y hora
            const [fechaParte, hora] = task.fechav.split(" ");

            // Verifica si fechaParte y hora tienen valores válidos
            if (!fechaParte || !hora || !fechaParte.includes('/')) {
                return false; // Excluye tareas con formato incorrecto
            }

            // Divide la fecha en día, mes y año
            const [dia, mes, anio] = fechaParte.split("/");

            // Verifica si dia, mes y anio tienen valores válidos
            if (!dia || !mes || !anio) {
                return false; // Excluye tareas con formato de fecha incorrecto
            }

            // Formatea la fecha y hora
            const fechaFormateada = `${anio}-${mes}-${dia}`;
            const fechaHora = `${fechaFormateada} ${hora}`;

            // Verifica si la fechaHora es válida
            return dayjs(fechaHora).format("YYYY-MM-DD") === date;
        });


        filteredTasks.sort((a, b) => {
            if (!a.fechav || !b.fechav) return 0;

            const timeA = dayjs(a.fechav, "DD/MM/YYYY HH:mm:ss").format(
                "HH:mm:ss"
            );
            const timeB = dayjs(b.fechav, "DD/MM/YYYY HH:mm:ss").format(
                "HH:mm:ss"
            );
            return dayjs(timeA, "HH:mm:ss").isBefore(dayjs(timeB, "HH:mm:ss"))
                ? -1
                : 1;
        });

        return filteredTasks;
    };

    return (
        <div className="bg-white rounded-lg shadow-md">
            <div className="grid grid-cols-7 divide-x divide-y border-gray-200" ref={parentRef}>
                {generateCalendarCells()}
            </div>
        </div>
    );
};

export default Calendar;
