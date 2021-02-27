const router = require('express').Router();
const utils = require('../utils');

router.use('/people/:sortBy?', async function(req, res) {
    const params = req.params.sortBy !== undefined ? req.params.sortBy : '';
    const people = await utils.getAllPages('people');
    if (params.length > 1) {
        switch(params) {
            case 'name':
                people.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
                break;
            case 'height':
                people.sort((a,b) => (a.height > b.height) ? 1 : ((b.height > a.height) ? -1 : 0));
                break;
            case 'mass':
                people.sort((a,b) => (a.mass > b.mass) ? 1 : ((b.mass > a.mass) ? -1 : 0));
                break;
            default:
                break;
        }
    }
    res.send(people);
});

router.use('/planets', async function(req, res) {
    const planets = await utils.getAllPages('planets');
    console.log(planets.length);
    res.send(planets);
});

module.exports = router;