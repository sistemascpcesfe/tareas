import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    Grid,
    GridItem,
    FormControl,
    FormLabel,
    FormHelperText,
    FormErrorMessage,
    Textarea,
    Select,
    Tag,
    TagLabel,
    TagCloseButton,
    Input,
    useToast
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { createTaskService } from '../../service/tarea';
import dayjs from 'dayjs';
import { useTask } from '../../provider/taskProvider';
import { getColorForTags } from '../../utils';
import { CiEdit } from 'react-icons/ci';
import { useLoadingStatus } from '../../provider/loadingStatusProvider';

const EditButton = ({ task, size }) => {
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { filterOptions, loading } = useTask()
    const { setIsStatus } = useLoadingStatus()
    const { triggerUpdate } = useTask()
    const [errors, setErrors] = useState({});
    const [userSesion, setUserSesion] = useState()
    const [formData, setFormData] = useState({
        date: '',
        title: '',
        description: '',
        selectedTags: [],
        selectedType: '',
        selectedUsers: [],
        alcance: '',
    });
    const [showAlcance, setShowAlcance] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem("user")
        setUserSesion(user)
        if (task) {
            initializeFormData();
        }
    }, []);

    const initializeFormData = () => {
        const dateProp = formatDateTime(task.fechav);

        setFormData({
            ...formData,
            date: dateProp,
            title: task.asunto,
            description: task.cuerpo,
            selectedTags: task.tag.split(','),
            selectedType: task.codigo,
            selectedTyped: task.codigod,
            selectedUsers: task.afecta.split(','),
            alcance: task.alcance ? task.alcance : '',
        });
    };


    const formatDateTime = (dateTimeString) => {
        const [datePart, timePart] = dateTimeString.split(' ');
        const [day, month, year] = datePart.split('/');
        const [hours, minutes] = timePart.split(':');

        // Formato requerido por datetime-local: YYYY-MM-DDTHH:mm
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target;

        if (name === 'selectedType') {
            const selectedOption = filterOptions.types.find(type => type.codigo === value);

            // Si el tipo seleccionado es 3, muestra el campo de alcance
            setShowAlcance(selectedOption.codigo === '3');

            setFormData(prevFormData => ({
                ...prevFormData,
                selectedType: selectedOption.codigo,
                selectedTyped: selectedOption.codigod
            }));
        } else if (name === 'selectedTags' || name === 'selectedUsers') {
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: [...prevFormData[name], value]
            }));
        } else {
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: value
            }));
        }
    };

    const handleTagRemove = (name, value) => {
        setFormData({
            ...formData,
            [name]: formData[name].filter(item => item !== value)
        });
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.selectedType) {
            newErrors.selectedType = 'El tipo es requerido.';
        }

        if (!formData.title) {
            newErrors.title = 'El asunto es requerido.';
        } else if (formData.title.length < 10) {
            newErrors.title = 'El asunto debe tener un mínimo de 10 caracteres.';
        }

        if (!formData.description) {
            newErrors.description = 'La descripción es requerida.';
        } else if (formData.description.length < 10) {
            newErrors.description = 'La descripción debe tener un mínimo de 10 caracteres.';
        }

        if (formData.selectedTags.length === 0) {
            newErrors.selectedTags = 'Al menos un tag es requerido.';
        }

        if (formData.selectedUsers.length === 0) {
            newErrors.selectedUsers = 'Al menos un usuario es requerido.';
        }

        if (task.tarea === '3' && !formData.alcance) {
            newErrors.alcance = 'El alcance es requerido para este tipo de tarea.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validate()) {
            try {
                const req = await createTaskService({
                    Usuario: task.usuario,
                    Sesion: localStorage.getItem('sesion'),
                    Asunto: formData.title,
                    Cuerpo: formData.description,
                    Fecha: dayjs().format('DD/MM/YYYY HH:mm:ss'),
                    Fechav: task.fechav,
                    Tag: formData.selectedTags.join(','),
                    Afecta: formData.selectedUsers.join(','),
                    Alcance: formData.alcance ? formData.alcance : 'todos',
                    Orden: task.orden,
                    Tarea: formData.selectedType, // Enviar el codigo
                    Taread: formData.selectedTyped, // Enviar el codigod
                });
                toast({
                    title: 'Tarea Creada',
                    description: `La tarea se ha creado correctamente. Id: ${req.id}`,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                setIsStatus(true);
                triggerUpdate();
                onClose();
            } catch (error) {
                console.error('Error creating task:', error);
                toast({
                    title: 'Tarea no creada',
                    description: `Hubo un problema al crear la tarea. Por favor, inténtalo de nuevo. ${error}`,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
    };
    console.log(task)

    return (
        <>
            <Button variant="ghost" onClick={onOpen}><CiEdit size={size} /></Button>
            <Modal isOpen={isOpen} onClose={onClose} size='6xl'>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Formulario para la edición de la tarea</ModalHeader>
                    <ModalCloseButton />
                    {loading ? (
                        <ModalBody>
                            <div className='flex justify-center w-full'>
                                Cargando...
                            </div>
                        </ModalBody>
                    ) : (

                        <ModalBody>
                            <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                                {userSesion === "valeria" ? (
                                    <GridItem colSpan={1}>
                                        <FormControl isInvalid={errors.selectedType}>
                                            <FormLabel>Tipo</FormLabel>
                                            <Select
                                                name='selectedType'
                                                value={formData.selectedType}
                                                onChange={handleSelectChange}
                                                defaultValue={task.tarea}
                                            >
                                                {filterOptions.types.map((type) => (
                                                    <option key={type.codigo} value={type.codigo}>
                                                        {type.codigod}
                                                    </option>
                                                ))}
                                            </Select>
                                            {!errors.selectedType ? null : (
                                                <FormErrorMessage>{errors.selectedType}</FormErrorMessage>
                                            )}
                                        </FormControl>
                                    </GridItem>
                                ) : (
                                    <GridItem colSpan={1}>
                                        <FormControl isInvalid={errors.selectedType}>
                                            <FormLabel>Tipo</FormLabel>
                                            <Select
                                                name='selectedType'
                                                value={task.taread}
                                                onChange={handleSelectChange}
                                                defaultValue={task.tarea}
                                                placeholder={task.taread}
                                                disabled
                                            >
                                            </Select>
                                            {!errors.selectedType ? null : (
                                                <FormErrorMessage>{errors.selectedType}</FormErrorMessage>
                                            )}
                                        </FormControl>
                                    </GridItem>
                                )}


                                {/* Mostrar el campo de alcance solo si selectedType es 3 */}
                                {showAlcance && (
                                    <GridItem colSpan={1}>
                                        <FormControl isRequired isInvalid={errors.alcance}>
                                            <FormLabel>Alcance</FormLabel>
                                            <Input
                                                type='text'
                                                name='alcance'
                                                value={formData.alcance}
                                                onChange={handleInputChange}
                                            />
                                            {!errors.alcance ? (
                                                <FormHelperText>
                                                    Introduce el alcance de la tarea.
                                                </FormHelperText>
                                            ) : (
                                                <FormErrorMessage>{errors.alcance}</FormErrorMessage>
                                            )}
                                        </FormControl>
                                    </GridItem>
                                )}
                                <GridItem colSpan={1}>
                                    <FormControl>
                                        <FormLabel>Asunto</FormLabel>
                                        <Input
                                            type='text'
                                            name='title'
                                            value={formData.title}
                                            onChange={handleInputChange}
                                        />
                                    </FormControl>
                                </GridItem>

                                <GridItem colSpan={1}>
                                    <FormControl isRequired isInvalid={errors.description}>
                                        <FormLabel>Descripción</FormLabel>
                                        <Textarea
                                            name='description'
                                            value={formData.description}
                                            onChange={handleInputChange}
                                        />
                                        {!errors.description ? (
                                            <FormHelperText>
                                                Introduce una descripción detallada de la tarea.
                                            </FormHelperText>
                                        ) : (
                                            <FormErrorMessage>{errors.description}</FormErrorMessage>
                                        )}
                                    </FormControl>
                                </GridItem>

                                <GridItem colSpan={1}>
                                    <FormControl isRequired isInvalid={errors.selectedTags}>
                                        <FormLabel>Tags</FormLabel>
                                        <Select
                                            name='selectedTags'
                                            value={formData.selectedTags}
                                            onChange={handleSelectChange}
                                            placeholder="Seleccione los tags"
                                        >
                                            {filterOptions.tags.map(tag => (
                                                <option key={tag} value={tag}>{tag}</option>
                                            ))}
                                        </Select>
                                        {formData.selectedTags.length === 0 && (
                                            <FormErrorMessage>{errors.selectedTags}</FormErrorMessage>
                                        )}
                                        <div>
                                            {formData.selectedTags.map(tag => (
                                                <Tag
                                                    key={tag}
                                                    variant='solid'
                                                    colorScheme={getColorForTags(task?.tarea)}
                                                    mr={2}
                                                    mt={2}
                                                >
                                                    <TagLabel>{tag}</TagLabel>
                                                    <TagCloseButton onClick={() => handleTagRemove('selectedTags', tag)} />
                                                </Tag>
                                            ))}
                                        </div>
                                    </FormControl>
                                </GridItem>



                                {task.tarea === '3' && (
                                    <GridItem colSpan={1}>
                                        <FormControl isRequired isInvalid={errors.alcance}>
                                            <FormLabel>Alcance</FormLabel>
                                            <Input
                                                type='text'
                                                name='alcance'
                                                value={formData.alcance}
                                                onChange={handleInputChange}
                                            />
                                            {!errors.alcance ? (
                                                <FormHelperText>
                                                    Introduce el alcance de la tarea.
                                                </FormHelperText>
                                            ) : (
                                                <FormErrorMessage>{errors.alcance}</FormErrorMessage>
                                            )}
                                        </FormControl>
                                    </GridItem>
                                )}

                                <GridItem colSpan={1}>
                                    <FormControl isRequired isInvalid={errors.selectedUsers}>
                                        <FormLabel>Usuarios afectados</FormLabel>
                                        <Select
                                            name='selectedUsers'
                                            value={formData.selectedUsers}
                                            onChange={handleSelectChange}
                                            placeholder="Seleccione los usuarios"
                                        >
                                            {filterOptions.users.map(user => (
                                                <option key={user.codigo} value={user.codigo}>{user.denominacion}</option>
                                            ))}
                                        </Select>
                                        {formData.selectedUsers.length === 0 && (
                                            <FormErrorMessage>{errors.selectedUsers}</FormErrorMessage>
                                        )}
                                        <div>
                                            {formData.selectedUsers.map(user => (
                                                <Tag
                                                    key={user}
                                                    variant='solid'
                                                    colorScheme={getColorForTags(task?.tarea)}
                                                    mr={2}
                                                    mt={2}
                                                >
                                                    <TagLabel>{user}</TagLabel>
                                                    <TagCloseButton onClick={() => handleTagRemove('selectedUsers', user)} />
                                                </Tag>
                                            ))}
                                        </div>
                                    </FormControl>
                                </GridItem>
                            </Grid>
                            <Button
                                mt={4}
                                colorScheme={getColorForTags(task?.tarea)}
                                onClick={handleSubmit}
                            >
                                Guardar Cambios
                            </Button>
                        </ModalBody>

                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default EditButton;
