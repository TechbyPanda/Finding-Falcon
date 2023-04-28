import { useEffect, useReducer, useState } from 'react'
import { getVehicles, getPlanets, getToken, findFalcone } from './Api'
import {
    Button,
    Typography,
    Box,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Modal
} from "@mui/material";
import { initialState, reducer } from './Action';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const MyModal = ({open, data, handleClose}) => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div style={{
                    fontSize: '80px',
                    textAlign: 'center',
                    margin: '10px'
                }}>
                    {data.status ? '🥳' : '😖'}
                </div>
                <Typography variant='h5' textAlign={'center'} id="modal-modal-description" sx={{ mt: 2 }}>
                    {data.status ? `Success! Congratulation on finding Falcone. King Shan is mighty pleased. She was find in ${data.planet_name}` : 'Oops! You are out of luck.'}
                </Typography>
            </Box>
        </Modal>
    )
}

const App = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [open, setOpen] = useState(false);
    const [data, setData] = useState({});
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        reset();
    }

    const handleDestination = (e, index) => {
        dispatch({
            type: 'setDestination',
            payload: {
                index,
                value: e.target.value,
            }
        });
    }

    const handleVehicle = (e, index) => {

        dispatch({
            type: 'setDestRide',
            payload: {
                index,
                value: e.target.value
            }
        })

        const planet = state.planets.find(obj => obj.name === state.destinations[index])
        const vehicle = state.vehicles.find(obj => obj.name === e.target.value)
        const time = planet.distance / vehicle.speed;

        dispatch({
            type: 'setTime',
            payload: {
                index,
                value: time
            }
        })

        dispatch({ type: 'takeAVehcileCount' })

    }


    const handleFindFalcone = async () => {
        const { token } = await getToken();
        const data = {
            token,
            planet_names: state.destinations,
            vehicle_names: state.destRides,
        };
        const res = await findFalcone(data);
        setData(res);
        handleOpen();
    }

    const reset = () => {
        window.location.reload(false)
    }


    const apiCall = async () => {
        const [planets, vehicles] = await Promise.all([getPlanets(), getVehicles()])
        dispatch({ type: 'setPlanets', planets })
        dispatch({ type: 'setVehicles', vehicles })
    }

    useEffect(() => {
        apiCall();
    }, [])

    return (
        <div>
            <MyModal open={open} data={data} handleClose={handleClose}/>
            <Box
                sx={{
                    margin: "0 auto",
                    width: "80%",
                    padding: "10px",
                }}
            >
                <Typography variant="h3" component="h3" textAlign="center">
                    Finding Falcon
                </Typography>
                <Typography variant="h6" component="h6" textAlign="center">
                    Time : {state.sum}
                </Typography>
                <Stack
                    direction="row"
                    spacing={2}
                    mt={6}
                    sx={{
                        minHeight: 600,
                    }}
                >
                    {state.destinations.map((val, index) => (
                        <FormControl fullWidth key={`destination-${index + 1}`}>
                            <InputLabel id={`destination-${index + 1}-label`}>
                                Destination {index + 1}
                            </InputLabel>
                            <Select
                                labelId={`destination-${index + 1}-label`}
                                id={`destination-${index + 1}`}
                                label={`destination-${index + 1}`}
                                onChange={(e) => handleDestination(e, index)}
                                value={state.destinations[index]}
                            >
                                {state.planets.map((planet) => {
                                    let i = state.destinations.indexOf(planet.name);
                                    if (i === -1 || i === index)
                                        return (
                                            <MenuItem
                                                key={`dest1-${planet.name}`}
                                                value={planet.name}
                                            >
                                                {planet.name}
                                            </MenuItem>
                                        );
                                })}
                            </Select>
                            {state.destinations[index] && (
                                <>
                                    <FormLabel
                                        id={`destination-${index + 1}-vehicle-label`}
                                        sx={{ marginTop: 10 }}
                                    >
                                        Vehicles
                                    </FormLabel>
                                    <RadioGroup
                                        aria-labelledby={`destination-${index + 1}-vehicle-label`}
                                        name={`destination-${index + 1}-vehicle`}
                                        value={state.destRides[index]}
                                        onChange={(e) => handleVehicle(e, index)}
                                    >
                                        {state.vehicles.map((vehicle) => {
                                            const value = state.planets.find(planet => planet.name === state.destinations[index])
                                            return (
                                                <FormControlLabel
                                                    key={`dest1-vehicle-${vehicle.name}`}
                                                    value={vehicle.name}
                                                    control={<Radio />}
                                                    label={vehicle.name}
                                                    disabled={value.distance > vehicle.max_distance || (state.vehicleCount.hasOwnProperty(vehicle.name) && state.vehicleCount[vehicle.name] >= vehicle.total_no && vehicle.name !== state.destRides[index])}
                                                />
                                            )
                                        })}
                                    </RadioGroup>
                                </>
                            )}
                        </FormControl>
                    ))}
                </Stack>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <Button variant="contained" onClick={handleFindFalcone} disabled={!state.destinations.every(val => val !== '') || !state.destRides.every(val => val !== '')}>Finding Falcon</Button>
                    <Button variant="text" onClick={reset}>Reset</Button>
                </Box>
            </Box>
        </div>
    )
}

export default App;