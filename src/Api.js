function getVehicles() {
    return (
        fetch('https://findfalcone.geektrust.com/vehicles')
            .then(res => res.json())
            .catch(error => console.log(error.message))
    )
}

function getPlanets() {
    return (
        fetch('https://findfalcone.geektrust.com/planets')
            .then(res => res.json())
            .catch(error => console.log(error))
    )
}

function getToken() {
    return (
        fetch('https://findfalcone.geektrust.com/token', {
            method: 'POST',
            headers: {
                Accept: 'application/json'
            }
        })
            .then(res => res.json())
            .catch(error => console.log(error))
    )
}

function findFalcone(data) {
    return (
        fetch('https://findfalcone.geektrust.com/find', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .catch(error => {
                throw error;
            })
    ) 
}


export {
    getVehicles,
    getPlanets,
    getToken,
    findFalcone
}