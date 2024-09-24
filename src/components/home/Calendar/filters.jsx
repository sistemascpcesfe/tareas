import {
    Button,
    Checkbox,
    CheckboxGroup,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverCloseButton,
    PopoverArrow,
    RadioGroup,
    Radio,
} from '@chakra-ui/react';
import { capitalizeFirstLetter } from '../../../utils/index';
import { useTask } from '../../../provider/taskProvider';

const FiltersComponent = () => {
    const { filters, setFilters, filterOptions, loading } = useTask();

    const handleFilterChange = (selectedValues, type) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [type]: selectedValues,
        }));
    };

    if (loading) {
        return <div>Cargando...</div>;
    }
    return (
        <div className="flex flex-col gap-2">
            <div className="grid grid-cols-5 gap-4">
                {/* Tipos de tarea */}
                <div className="flex flex-col">
                    <Popover>
                        <PopoverTrigger>
                            <Button size="sm" width="100%">
                                Tipos
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverHeader>Tipos</PopoverHeader>
                            <PopoverBody size="lg">
                                <RadioGroup
                                    value={filters.types}
                                    onChange={(values) => handleFilterChange(values, 'types')}
                                >
                                    <div className="grid grid-cols-2 gap-2">
                                        {filterOptions.types.map((e, index) => (
                                            <Radio
                                                key={`type-${e.codigo || index}`} // Backup with index if codigo is missing
                                                value={e.codigo}
                                                className="whitespace-nowrap overflow-hidden overflow-ellipsis"
                                            >
                                                {e.codigod &&
                                                    capitalizeFirstLetter(e.codigod.toLowerCase())}
                                            </Radio>
                                        ))}
                                        <Radio
                                            key="type-todos"
                                            value=""
                                            className="whitespace-nowrap overflow-hidden overflow-ellipsis"
                                        >
                                            Todos
                                        </Radio>
                                    </div>
                                </RadioGroup>
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Etiquetas */}
                <div className="flex flex-col">
                    <Popover>
                        <PopoverTrigger>
                            <Button size="sm" width="100%">
                                Etiquetas
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverHeader>Etiquetas</PopoverHeader>
                            <PopoverBody>
                                <CheckboxGroup
                                    value={filters.tags}
                                    onChange={(values) => handleFilterChange(values, 'tags')}
                                >
                                    <div className="grid grid-cols-2 gap-2">
                                        {filterOptions.tags.map((e, index) => (
                                            <Checkbox
                                                key={`tag-${e || index}`} // Use index if tag is missing or duplicate
                                                value={e}
                                                className="whitespace-nowrap overflow-hidden overflow-ellipsis"
                                            >
                                                {e && capitalizeFirstLetter(e.toLowerCase())}
                                            </Checkbox>
                                        ))}
                                    </div>
                                </CheckboxGroup>
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Usuarios */}
                <div className="flex flex-col">
                    <Popover>
                        <PopoverTrigger>
                            <Button size="sm" width="100%">
                                Usuarios
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverHeader>Usuarios</PopoverHeader>
                            <PopoverBody>
                                <CheckboxGroup
                                    value={filters.users}
                                    onChange={(values) => handleFilterChange(values, 'users')}
                                >
                                    <div className="grid grid-cols-2 gap-2">
                                        {filterOptions.users.map((e, index) => (
                                            <Checkbox
                                                key={`user-${e.codigo || index}`} // Use index as fallback if codigo is missing
                                                value={e.codigo}
                                                className="whitespace-nowrap overflow-hidden overflow-ellipsis"
                                            >
                                                {e.denominacion &&
                                                    capitalizeFirstLetter(e.denominacion.toLowerCase())}
                                            </Checkbox>
                                        ))}
                                    </div>
                                </CheckboxGroup>
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Estados */}
                <div className="flex flex-col">
                    <Popover>
                        <PopoverTrigger>
                            <Button size="sm" width="100%">
                                Estados
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverHeader>Estados</PopoverHeader>
                            <PopoverBody size="lg">
                                <RadioGroup
                                    value={filters.status}
                                    onChange={(values) => handleFilterChange(values, 'status')}
                                >
                                    <div className="grid grid-cols-2 gap-2">
                                        {filterOptions.status.map((e, index) => (
                                            <Radio
                                                key={`status-${e.codigo || index}`} // Backup with index if codigo is missing
                                                value={e.codigo}
                                                className="whitespace-nowrap overflow-hidden overflow-ellipsis"
                                            >
                                                {e.codigod &&
                                                    capitalizeFirstLetter(e.codigod.toLowerCase())}
                                            </Radio>
                                        ))}
                                        <Radio
                                            key="status-todos"
                                            value=""
                                            className="whitespace-nowrap overflow-hidden overflow-ellipsis"
                                        >
                                            Todos
                                        </Radio>
                                    </div>
                                </RadioGroup>
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </div>
    );
};

export default FiltersComponent;
