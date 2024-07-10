import { createContext, useContext, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es'); // Establecer locale en español

const LoadingStatusContext = createContext();

export const LoadingStatusProvider = ({ children }) => {
    const [isStatus, setIsStatus] = useState(false);


    return (
        <LoadingStatusContext.Provider value={{ isStatus, setIsStatus }}>
            {children}
        </LoadingStatusContext.Provider>
    );
};

export const useLoadingStatus = () => {
    return useContext(LoadingStatusContext);
};
