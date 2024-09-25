import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Spinner, Tag } from "@chakra-ui/react";
import { getFileService } from '../../../service/tarea';
import { downloadFile } from "../../../utils";
import HeaderCard from "./headerCard";
import { useCallback, useEffect, useState } from "react";

const DetailComponente = ({ color, task, isLoadingTask, isDefaultOpen }) => {
    const [files, setFiles] = useState([]);
    const [isLoadingFiles, setIsLoadingFiles] = useState(false);

    const tagsArray = task?.tag ? task.tag.split(',') : [];
    const usersArray = task?.afecta ? task.afecta.split(',') : [];

    const handleDownload = (file) => {
        downloadFile(file.cuerpo, file.archivo);
    };

    console.log(task)

    const getFiles = useCallback(async () => {
        try {
            setIsLoadingFiles(true);
            const filesResponse = await getFileService({ Tarea: task.orden });
            setFiles(filesResponse.items);
        } catch (error) {
            console.error('Error al cargar los archivos de la tarea:', error);
        } finally {
            setIsLoadingFiles(false);
        }
    }, [task.orden]);

    useEffect(() => {
        getFiles();
    }, [getFiles]);

    return (
        <div className="mb-1">
            <Accordion allowToggle defaultIndex={isDefaultOpen ? [0] : []} className=" border-x">
                <AccordionItem>
                    <h2>
                        <AccordionButton _expanded={{ bg: `${color}.300` }} className="">
                            <Box as="span" flex="1" textAlign="left">
                                <span className="text-base font-semibold">{task.asunto}</span>
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel>
                        <div className="flex justify-between">
                            <div className="w-full">
                                <div className="p-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2 sm:col-span-1">
                                            {[
                                                { label: "Tarea", value: task.taread },
                                                { label: "Estado", value: <Tag colorScheme={color} className="mr-2 mb-2">{task.estadod}</Tag> },
                                                { label: "Tags", value: tagsArray.map((tag, index) => <Tag key={index} colorScheme={color} className="mr-2 mb-2">{tag.trim()}</Tag>) },
                                                { label: "Cuerpo", value: task.cuerpo }
                                            ].map(({ label, value }, index) => (
                                                <div className="py-2" key={index}>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}:</label>
                                                    <span>{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="col-span-2 sm:col-span-1">
                                            {[
                                                { label: "Usuario", value: task.usuario },
                                                { label: "Afecta", value: usersArray.map((user, index) => <Tag key={index} colorScheme={color} className="mr-2 mb-2">{user.trim()}</Tag>) },
                                                { label: "Alcance", value: task.alcance },
                                                { label: "Seguridad", value: task.privado === "0" ? "Global" : "Privado" }
                                            ].map(({ label, value }, index) => (
                                                <div className="py-2" key={index}>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}:</label>
                                                    <span>{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {isLoadingFiles ? (
                                    <div className="mt-8 flex gap-2">
                                        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="md" />
                                        <h2>Comprobando archivos adjuntos...</h2>
                                    </div>
                                ) : (
                                    files.length > 0 && (
                                        <div className="mt-8">
                                            <Box className="flex flex-wrap gap-2">
                                                <h3 className="text-dm font-semibold">Archivos:</h3>
                                                {files.map((file, index) => (
                                                    <Button key={index} size="sm" colorScheme={color} onClick={() => handleDownload(file)} className="mr-2">
                                                        {file?.archivo?.length > 35 ? `${file.archivo.substring(0, 35)}...` : file.archivo}
                                                    </Button>
                                                ))}
                                            </Box>
                                        </div>
                                    )
                                )}
                            </div>
                            <HeaderCard afectado={task.afectado} color={color} task={task} files={files} isLoadingTask={isLoadingTask} isLoadingFiles={isLoadingFiles} />
                        </div>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default DetailComponente;
