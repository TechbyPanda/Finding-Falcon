const initialState = {
    planets: [],
    vehicles: [],
    destinations: new Array(4).fill(''),
    destRides: new Array(4).fill(''),
    time: [],
    sum: 0,
    vehicleCount: {}
}

function reducer(state, action) {
    const { index, value } = action.payload || { index: 0, value: 0 }

    switch (action.type) {
        case 'setPlanets':
            return {
                ...state,
                planets: action.planets
            }

        case 'setVehicles':
            return {
                ...state,
                vehicles: action.vehicles
            }

        case 'setDestination':
            let destinations = [...state.destinations];
            destinations[index] = value;
            return {
                ...state,
                destinations,
            }

        case 'setDestRide':
            let destRides = [...state.destRides]
            destRides[index] = value;
            return {
                ...state,
                destRides
            }

        case 'setTime':
            let time = [...state.time];
            time[index] = value;
            let sum = time.reduce((acc, curr) => acc + curr, 0);
            return {
                ...state,
                time,
                sum,
            };

        case 'takeAVehcileCount':
            let vehicleCount = {};
            const rides = [...state.destRides];

            for (let ride of rides) {
                if (ride === '') continue;
                if (!vehicleCount.hasOwnProperty(ride)) {
                    vehicleCount[ride] = 0;
                }
                vehicleCount[ride] += 1;
            }
            console.log(vehicleCount)
            return {
                ...state,
                vehicleCount
            }

        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

export {
    initialState,
    reducer
}