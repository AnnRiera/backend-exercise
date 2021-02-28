const axios = require('axios');

module.exports = {  
    /**
    * Function Decription: Get Paginate Data from SWAPI
    * @param {String} endpoint Endpoint to get the data
    */
    async getAllPages(endpoint) {
        let full_data = [];
        // First page
        if (endpoint.length > 0) {
            return await axios(`https://swapi.dev/api/${endpoint}`)
            .then(response => {
                // Collect planets from first page
                full_data = response.data.results;
                return response.data.count;
            })
            .then(async count => {
                // Exclude the first request
                const numberOfPagesLeft = Math.ceil((count - 1) / 10);
                let promises = [];
                // Start at 2 as you already queried the first page
                for (let i = 2; i <= numberOfPagesLeft; i++) {
                    promises.push(await axios(`https://swapi.dev/api/${endpoint}/?page=${i}`));
                }
                return Promise.all(promises);
            })
            .then(response => {
                // Get the rest records - pages 2 through n.
                full_data = response.reduce((acc, data) => [...acc, ...data.data.results], full_data);
                return full_data;
            })
            .catch(error => console.log(error));
        }  
    }
}