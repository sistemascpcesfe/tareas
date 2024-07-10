import { createContext, useContext, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es'); // Establecer locale en español

const DateContext = createContext();

export const DateProvider = ({ children }) => {
    const [currentDate, setCurrentDate] = useState(dayjs());

    const today = dayjs();

    const goToPreviousMonth = () => {
        setCurrentDate(currentDate.subtract(1, 'month'));
    };

    const goToNextMonth = () => {
        setCurrentDate(currentDate.add(1, 'month'));
    };

    return (
        <DateContext.Provider value={{ currentDate, setCurrentDate, goToPreviousMonth, goToNextMonth, today }}>
            {children}
        </DateContext.Provider>
    );
};

export const useDate = () => {
    return useContext(DateContext);
};
