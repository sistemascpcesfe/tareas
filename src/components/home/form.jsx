import {
    Button,
    FormControl,
    FormLabel,
    Input,
    FormHelperText,
    FormErrorMessage,
    Textarea,
    GridItem,
    Grid,
    Select,
    Tag,
    TagLabel,
    TagCloseButton,
    useToast,
    RadioGroup,
    Stack,
    Radio
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { createTaskService, tagService, typesTasksService, usersService } from '../../service/tarea';
import dayjs from 'dayjs';
import { useTask } from '../../provider/taskProvider';
import { useNavigate } from 'react-router-dom';

const FormComponent = () => {
    const navigate = useNavigate()
    const toast = useToast()
    const { triggerUpdate } = useTask();
    const [tags, setTags] = useState([]);
    const [types, setTypes] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        date: '',
        title: '',
        description: '',
        selectedTags: [],
        selectedType: '',
        selectedUsers: [],
        alcance: '',
        privado: 0
    });

    useEffect(() => {
        getDataService();
    }, []);

    const getDataService = async () => {
        try {
            setLoading(true);
            const tagsRes = await tagService();
            setTags(tagsRes.tags);
            const typesRes = await typesTasksService();
            setTypes(typesRes.items);
            const usersRes = await usersService();
            setUsers(usersRes.items);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
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
        setFormData(prevFormData => {
            const selectedItems = [...prevFormData[name], value].filter((v, i, a) => a.indexOf(v) === i); // Remove duplicates
            return {
                ...prevFormData,
                [name]: selectedItems
            };
        });
    };

    const handleTagRemove = (name, value) => {
        setFormData({
            ...formData,
            [name]: formData[name].filter(item => item !== value)
        });
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.date) {
            newErrors.date = 'La fecha y hora son requeridos.';
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

        if (!formData.selectedType) {
            newErrors.selectedType = 'El tipo es requerido.';
        }

        if (formData.selectedTags.length === 0) {
            newErrors.selectedTags = 'Al menos un tag es requerido.';
        }

        if (formData.selectedUsers.length === 0) {
            newErrors.selectedUsers = 'Al menos un usuario es requerido.';
        }

        if (formData.privado === null) {
            newErrors.selectedPriv = 'Debe seleccionar si quiere que la tarea sea privada o global.';
        }

        // Validación específica para alcance si el tipo es 3
        if (formData.selectedType === '3' && !formData.alcance) {
            newErrors.alcance = 'El alcance es requerido para este tipo de tarea.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validate()) {
            try {
                const req = await createTaskService({
                    Usuario: localStorage.getItem('user'),
                    Sesion: localStorage.getItem('sesion'),
                    Asunto: formData.title,
                    Cuerpo: formData.description,
                    Fecha: dayjs().format('DD/MM/YYYY HH:mm:ss'),
                    Fechav: dayjs(formData.date).format('DD/MM/YYYY HH:mm:ss'),
                    Tag: formData.selectedTags.join(','),
                    Tarea: formData.selectedType,
                    Afecta: formData.selectedUsers.join(','),
                    Alcance: formData.alcance ? formData.alcance : 'todos',
                    Privado: formData.privado ? formData.privado : 0
                });

                triggerUpdate()

                // Mostrar toast de éxito
                toast({
                    title: 'Tarea Creada',
                    description: `La tarea se ha creado correctamente. Id: ${req.id}`,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                })

                navigate(`/agenda-comunicacion/${req.id}`);
            } catch (error) {
                console.error('Error creating task:', error);
                // Mostrar toast de error
                toast({
                    title: 'Tarea no creada',
                    description: `Hubo un problema al crear la tarea. Por favor, inténtalo de nuevo. Id: ${error}`,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
            }
        }
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <>
                <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                    <GridItem colSpan={1}>
                        <FormControl isRequired isInvalid={errors.selectedType}>
                            <FormLabel>Tipo</FormLabel>
                            <Select
                                name='selectedType'
                                onChange={handleInputChange}
                                defaultValue={''}
                            >
                                <option value='' disabled>Seleccione el tipo</option>
                                {types.map(type => (
                                    <option key={type.codigo} value={type.codigo}>{type.codigod}</option>
                                ))}
                            </Select>
                            {!errors.selectedType ? (
                                <FormHelperText>
                                    Seleccione el tipo de tarea que quiere crear.
                                </FormHelperText>
                            ) : (
                                <FormErrorMessage>{errors.selectedType}</FormErrorMessage>
                            )}
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={1}>
                        <FormControl isRequired isInvalid={errors.title}>
                            <FormLabel>Asunto</FormLabel>
                            <Input
                                type='text'
                                name='title'
                                value={formData.title}
                                onChange={handleInputChange} />
                            {!errors.title ? (
                                <FormHelperText>
                                    Introduce el asunto de la tarea.
                                </FormHelperText>
                            ) : (
                                <FormErrorMessage>{errors.title}</FormErrorMessage>
                            )}
                        </FormControl>
                    </GridItem>

                    <GridItem colSpan={1}>
                        <FormControl isRequired isInvalid={errors.description}>
                            <FormLabel>Descripción</FormLabel>
                            <Textarea
                                name='description'
                                value={formData.description}
                                onChange={handleInputChange} />
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
                        <FormControl isRequired isInvalid={errors.date}>
                            <FormLabel>Fecha</FormLabel>
                            <Input
                                type='datetime-local'
                                name='date'
                                value={formData.date}
                                onChange={handleInputChange} />
                            {!errors.date ? (
                                <FormHelperText>
                                    Introduce la fecha y hora de publicación de la tarea.
                                </FormHelperText>
                            ) : (
                                <FormErrorMessage>{errors.date}</FormErrorMessage>
                            )}
                        </FormControl>
                    </GridItem>

                    <GridItem colSpan={1}>
                        <FormControl isRequired isInvalid={errors.selectedTags}>
                            <FormLabel>Tag</FormLabel>
                            <Select
                                name='selectedTags'
                                onChange={handleSelectChange}
                                defaultValue={''}
                            >
                                <option value='' disabled>Seleccione un tag</option>
                                {tags.map(tag => (
                                    <option key={tag} value={tag}>{tag}</option>
                                ))}
                            </Select>
                            {formData.selectedTags.length === 0 && (
                                <FormErrorMessage>{errors.selectedTags}</FormErrorMessage>
                            )}
                            <div>
                                {formData.selectedTags.map(value => (
                                    <Tag
                                        key={value}
                                        variant='solid'
                                        colorScheme='blue'
                                        mr={2}
                                        mt={2}
                                    >
                                        <TagLabel>{value}</TagLabel>
                                        <TagCloseButton onClick={() => handleTagRemove('selectedTags', value)} />
                                    </Tag>
                                ))}
                            </div>
                        </FormControl>
                    </GridItem>



                    {formData.selectedType === '3' && (
                        <GridItem colSpan={1}>
                            <FormControl isRequired isInvalid={errors.alcance}>
                                <FormLabel>Alcance</FormLabel>
                                <Input
                                    type='text'
                                    name='alcance'
                                    value={formData.alcance}
                                    onChange={handleInputChange} />
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
                                onChange={handleSelectChange}
                                defaultValue={''}
                            >
                                <option value='' disabled>Seleccione un usuario</option>
                                {users.map(user => (
                                    <option key={user.codigo} value={user.codigo}>{user.denominacion}</option>
                                ))}
                            </Select>
                            {formData.selectedUsers.length === 0 && (
                                <FormErrorMessage>{errors.selectedUsers}</FormErrorMessage>
                            )}
                            <div>
                                {formData.selectedUsers.map(value => (
                                    <Tag
                                        key={value}
                                        variant='solid'
                                        colorScheme='blue'
                                        mr={2}
                                        mt={2}
                                    >
                                        <TagLabel>{value}</TagLabel>
                                        <TagCloseButton onClick={() => handleTagRemove('selectedUsers', value)} />
                                    </Tag>
                                ))}
                            </div>
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={1}>
                        <FormControl isRequired isInvalid={errors.selectedPriv}>
                            <FormLabel>Privacidad</FormLabel>
                            <RadioGroup
                                onChange={(value) => setFormData({ ...formData, privado: parseInt(value, 10) })}
                                value={formData.privado}
                            >
                                <Stack direction="row">
                                    <Radio value={0}>Global</Radio>
                                    <Radio value={1}>Privado</Radio>
                                </Stack>
                            </RadioGroup>
                            {errors.selectedPriv && (
                                <FormErrorMessage>{errors.selectedPriv}</FormErrorMessage>
                            )}
                        </FormControl>
                    </GridItem>
                </Grid>
                <Button
                    mt={4}
                    colorScheme='blue'
                    onClick={handleSubmit}
                >
                    Crear Tarea
                </Button>
            </>
        </div>
    );
};

export default FormComponent;
