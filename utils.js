const axios = require('axios');

module.exports = {  
    async getAllPages(endpoint) {
        let full_data = [];
        // first page
        if (endpoint.length > 0) {
            return await axios(`https://swapi.dev/api/${endpoint}`)
            .then(response => {
                // collect planets from first page
                full_data = response.data.results;
                return response.data.count;
            })
            .then(async count => {
                // exclude the first request
                const numberOfPagesLeft = Math.ceil((count - 1) / 10);
                let promises = [];
                // start at 2 as you already queried the first page
                for (let i = 2; i <= numberOfPagesLeft; i++) {
                    promises.push(await axios(`https://swapi.dev/api/${endpoint}/?page=${i}`));
                }
                return Promise.all(promises);
            })
            .then(response => {
                //get the rest records - pages 2 through n.
                full_data = response.reduce((acc, data) => [...acc, ...data.data.results], full_data);
                return full_data;
            })
            .catch(error => console.log(error));
        }  
    }
}