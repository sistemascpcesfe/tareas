import LogoutButton from "../../buttons/LogoutButton";
import FiltersComponent from "./filters";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useDate } from "../../../provider/dateProvider";
import {
    Button,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger
} from '@chakra-ui/react';
import CreateTask from "../../buttons/CreateTask";
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useState } from "react";

dayjs.locale('es');

const Header = () => {
    const { currentDate, setCurrentDate } = useDate();
    const [selectedYear, setSelectedYear] = useState(currentDate.year());

    const goToPreviousMonth = () => {
        setCurrentDate(currentDate.subtract(1, 'month'));
    };

    const goToNextMonth = () => {
        setCurrentDate(currentDate.add(1, 'month'));
    };

    const goToPreviousYear = () => {
        setSelectedYear(selectedYear - 1);
    };

    const goToNextYear = () => {
        setSelectedYear(selectedYear + 1);
    };

    const formatMonthYear = (date) => {
        const month = date.format('MMMM');
        return month.charAt(0).toUpperCase() + month.slice(1) + ' ' + date.format('YYYY');
    };

    const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const monthsOfYear = Array.from({ length: 12 }, (_, i) => dayjs().month(i).year(selectedYear));

    const selectMonth = (monthIndex) => {
        const newDate = dayjs().year(selectedYear).month(monthIndex);
        setCurrentDate(newDate);
    };

    return (
        <Popover>
            <div className={`h-40 bg-white`}>
                <div className={`grid grid-cols-5 border-b px-4`}>
                    <div className="col-span-2 items-center flex">
                        <FiltersComponent />
                    </div>
                    <div className="col-span-1 h-32 flex items-center justify-center text-black">
                        <Button variant='ghost' onClick={goToPreviousMonth}><FaChevronLeft size={20} /></Button>
                        <PopoverTrigger>
                            <Button variant='ghost' className="h-9 w-32 text-center text-xl mx-4">{formatMonthYear(currentDate)}</Button>
                        </PopoverTrigger>
                        <Button variant='ghost' onClick={goToNextMonth}><FaChevronRight size={20} /></Button>
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-4">
                        <CreateTask />
                        <LogoutButton />
                    </div>
                </div>
                <div className="grid grid-cols-7 items-center pt-1 border-gray-200">
                    {daysOfWeek.map((day, index) => (
                        <div
                            key={index}
                            className="text-center font-semibold border-gray-200"
                        >
                            {day}
                        </div>
                    ))}
                </div>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>Selecciona el Mes</PopoverHeader>
                    <PopoverBody>
                        <div className="flex flex-col items-center">
                            <div className="flex items-center mb-4">
                                <Button variant='ghost' onClick={goToPreviousYear}><FaChevronLeft size={20} /></Button>
                                <span className="mx-2 text-xl">{selectedYear}</span>
                                <Button variant='ghost' onClick={goToNextYear}><FaChevronRight size={20} /></Button>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {monthsOfYear.map((month, index) => (
                                    <Button
                                        key={index}
                                        onClick={() => selectMonth(index)}
                                        variant='ghost'
                                    >
                                        <span className={`${month.format('MM/YYYY') === currentDate.format('MM/YYYY') ? "text-blue-500" : ""}`}>
                                            {month.format('MMMM').charAt(0).toUpperCase() + month.format('MMMM').slice(1)}
                                        </span>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </PopoverBody>
                </PopoverContent>
            </div>
        </Popover>
    );
};

export default Header;
