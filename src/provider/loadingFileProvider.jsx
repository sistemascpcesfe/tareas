import { createContext, useContext, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es'); // Establecer locale en español

const LoadingFileContext = createContext();

export const LoadingFileProvider = ({ children }) => {
    const [isFile, setIsFile] = useState(false);


    return (
        <LoadingFileContext.Provider value={{ isFile, setIsFile }}>
            {children}
        </LoadingFileContext.Provider>
    );
};

export const useLoadingFile = () => {
    return useContext(LoadingFileContext);
};
