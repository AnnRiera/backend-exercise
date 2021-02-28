const router = require('express').Router();
const utils = require('../utils/utils');

router.use('/people/:sortBy?', async function(req, res) {
    const params = req.params.sortBy !== undefined ? req.params.sortBy : '';
    // To get all pages
    let people = await utils.getAllPages('people');
    if (params.length > 1) {
        // For sorting options
        switch(params) {
            case 'name':
                people.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
                break;
            case 'height':
                // To replace the unknown height with "0" value
                people = people.map(i => {
                    i.height = i.height.replace(/unknown/,"0");
                    return i;
                });
                // To sort ascending the people by height
                people.sort((a,b) => a.height - b.height);
                // To return its original value of the height field
                people.forEach(x => {
                    if (x.height === "0") {
                        x.height = "unknown";
                    }
                });
                break;
            case 'mass':
                let highMass = '';
                people = people.map(i => {
                    // To save the original value of Jabba's mass
                    if (i.mass.includes(',') == true) {
                        highMass = i.mass;
                    }
                    // To remove the comma-separator in Jabba's mass
                    i.mass = i.mass.replace(/,/g,'');
                    // To replace the unknown mass with "0" value
                    i.mass = i.mass.replace(/unknown/,"0");
                    return i;
                });
                // To sort ascending the people by mass
                people.sort((a,b) => a.mass - b.mass);
                people.forEach(x => {
                    // To return its original value of the mass field
                    if (x.mass === "0") {
                        x.mass = "unknown";
                    }
                    // To return the original mass to Jabba's field
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
    // To get all pages
    const all = await utils.getAllPages('planets');
    const people = await utils.getAllPages('people');
    // To filter and get an object with name and url
    const residents = people.map(x => {
        return { "name": x.name, "url": x.url }
    });
    for (const planet of all) {
        let rsdt = [];
        for (const resident of planet.residents) {
            // To get the match objects
            const match_objs = residents.find(resi => resident === resi.url);
            rsdt.push(match_objs.name);
        }
        // To asign the names of the residents field to the current planet
        planet.residents = rsdt;
    }
    res.send(all);
});

module.exports = router;