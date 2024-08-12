import { Box } from "@chakra-ui/react";
import DeriveButton from "../../buttons/DeriveButton";
import FileButton from "../../buttons/fileButton";
import RepeatButton from "../../buttons/RepeatButton";
import StatusButton from "../../buttons/StatusButton";
import EditButton from "../../buttons/EditButton";

const HeaderCard = ({ afectado, color, task, isLoadingTask, files, isLoadingFiles }) => {

    const size = 24

    return (
        <Box className="h-auto w-fit flex flex-col justify-center items-end py-2 pl-4 border-l">
            {!isLoadingTask ? (
                <>
                    <FileButton size={size} colorScheme={color} asunto={task.asunto} id={task.orden} />
                    <StatusButton size={size} colorScheme={color} id={task.orden} />
                    <RepeatButton size={size} colorScheme={color} id={task.orden} task={task} files={files} isLoadingFiles={isLoadingFiles} />
                    <EditButton size={size} colorScheme={color} task={task}>Editar</EditButton>
                    {!afectado ? (
                        <DeriveButton size={size} colorScheme={color} task={task} />
                    ) : null}
                </>
            ) : null}
        </Box>
    )
}

export default HeaderCard;