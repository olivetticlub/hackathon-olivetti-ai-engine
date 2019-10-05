var express = require('express')

import Genetic from './algorithms/Genetic';
import {dispersion, fitness} from './utils/Functions';

const port = process.env.PORT
const options = require('./options.json');
const team_size = options.team_size;

var app = express()

app.use(express.json());
app.listen(port)
app.post('/merchants', function(req, res) {
    let request = req.body
    let referringMerchant = request.referringMerchant
    let merchantsjson = request.merchantsPool
    
    console.log("received request:")
    console.log(request)
    
    let merchants = []
    for(let id in merchantsjson) {
        merchants.push(createMerchantFrom(merchantsjson[id], id))
    }

    if(merchants.length <= team_size) {
        res.send(merchants)
        return
    }

    let genetic = initializeGeneticSystem(referringMerchant, merchants);
    
    let genetic_team = genetic.select();
    
    //console.log(`[Genetic] Genetic algorithm executed in ${genetic.time}ms`);
    //console.log('[Genetic] Fitness:', genetic.metrics.fitness);
    //console.log('[Genetic] Iterations:', genetic.iterations.length);

    console.log("team:")
    console.log(genetic_team)
    res.send(genetic_team)
});

function initializeGeneticSystem(referringMerchant, merchants): Genetic {
    return new Genetic(referringMerchant, merchants, team_size, dispersion, fitness, {
        mutation_probability: 0.01,
        crossover_probability: 0.80,
        population: 50,
        iterations: 100
    })
}

function createMerchantFrom(merchant, id) {
    return {
        city : 1,
        lat : merchant.coordinates.lat,
        lng : merchant.coordinates.lng,

        ateco: merchant.ateco,
        owner : merchant.name,
        id : id,
        capability : 1,
        coupons : 1,
        sort: null
    }
}