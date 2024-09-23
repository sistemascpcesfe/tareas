import { RadioGroup, Radio, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { useTask } from "../../provider/taskProvider";

const ToggleButtonGroup = ({ onToggle }) => {
    const [state, setState] = useState("global");
    const { setFilters } = useTask();

    const handleFilterChange = (newState) => {
        const filterValue = newState === 'global' ? 0 : 1;
        setFilters({ privado: filterValue }); // Establece el filtro con 0 (Global) o 1 (Privado)
    };

    const handleToggle = (newState) => {
        setState(newState);
        handleFilterChange(newState); // Actualiza el filtro cuando cambia el estado
        if (onToggle) onToggle(newState === 'global' ? 0 : 1); // Envía 0 si es global, 1 si es privado
    };

    return (
        <RadioGroup
            onChange={(value) => handleToggle(value)}
            value={state}
        >
            <Stack direction="row">
                <Radio value="global">Global</Radio>
                <Radio value="privado">Privado</Radio>
            </Stack>
        </RadioGroup>
    );
};

export default ToggleButtonGroup;
