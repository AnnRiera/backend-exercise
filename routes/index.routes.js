const router = require('express').Router();
const utils = require('../utils');
const axios = require('axios');

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
    const all = await utils.getAllPages('planets');
    const people = await utils.getAllPages('people');
    const residents = people.map(x => {
        return { "name": x.name, "url": x.url }
    });
    for (const planet of all) {
        let rsdt = [];
        for (const resident of planet.residents) {
            const match_objs = residents.find(resi => resident === resi.url);
            rsdt.push(match_objs.name);
        }
        planet.residents = rsdt;
    }
    res.send(all);
});

module.exports = router;