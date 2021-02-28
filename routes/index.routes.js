const router = require('express').Router();
const utils = require('../utils/utils');

router.use('/people/:sortBy?', async function(req, res) {
    const params = req.params.sortBy !== undefined ? req.params.sortBy : '';
    let people = await utils.getAllPages('people');
    if (params.length > 1) {
        switch(params) {
            case 'name':
                people.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
                break;
            case 'height':
                people = people.map(i => {
                    i.height = i.height.replace(/unknown/,"0");
                    return i;
                });
                people.sort((a,b) => a.height - b.height);
                people.forEach(x => {
                    if (x.height === "0") {
                        x.height = "unknown";
                    }
                });
                break;
            case 'mass':
                let highMass = '';
                people = people.map(i => {
                    if (i.mass.includes(',') == true) {
                        highMass = i.mass;
                    }
                    i.mass = i.mass.replace(/,/g,'');
                    i.mass = i.mass.replace(/unknown/,"0");
                    return i;
                });
                people.sort((a,b) => a.mass - b.mass);
                people.forEach(x => {
                    if (x.mass === "0") {
                        x.mass = "unknown";
                    }
                    if (x.name.indexOf('Jabba') !== -1) {
                        x.mass = highMass;
                    }
                });
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