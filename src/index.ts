var express = require('express')

import Genetic from './algorithms/Genetic';
import {dispersion, fitness} from './utils/Functions';

const port = process.env.PORT
const options = require('./options.json');

var app = express()

app.use(express.json());
app.listen(port)
app.post('/merchants', function(req, res) {
    let request = req.body
    let referringMerchant = createMerchantFrom(request.referringMerchant, 0)
    let merchantsjson = request.merchantsPool
    
    console.log("received request:")
    console.log(request)
    
    let merchants = []
    for(let id in merchantsjson) {
        merchants.push(createMerchantFrom(merchantsjson[id], id))
    }

    if(merchants.length <= options.team_size) {
        res.send(merchants)
        return
    }

    let genetic = initializeGeneticSystem(referringMerchant, merchants);
    let genetic_team = genetic.select();

    console.log("team:")
    console.log(genetic_team)

    res.send(genetic_team)
});

function initializeGeneticSystem(referringMerchant, merchants): Genetic {
    return new Genetic(referringMerchant, merchants, options.team_size, dispersion, fitness, {
        mutation_probability: options.mutation_probability,
        crossover_probability: options.crossover_probability,
        population: options.population,
        iterations: options.iterations
    })
}

function createMerchantFrom(merchant, id) {
    return {
        id : id,
        owner : merchant.name,
        lat : merchant.coordinates.lat,
        lng : merchant.coordinates.lng,
        ateco: merchant.ateco,
        sort: null
    }
}