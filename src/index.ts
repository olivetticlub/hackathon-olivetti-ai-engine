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
    let merchantsjson = request.merchants
    let referringMerchant = request.merchant
    
    let merchants = []
    for(let id in merchantsjson) {
        merchants.push({
            city : 1,
            lat : merchantsjson[id].lat,
            lng : merchantsjson[id].lng,

            ateco: merchantsjson[id].ateco,
            owner : merchantsjson[id].name,
            id : id,
            capability : 1,
            coupons : 1,
            sort: null
        })
    }

    let genetic = new Genetic(referringMerchant, merchants, team_size, dispersion, fitness, {
        mutation_probability: 0.01,
        crossover_probability: 0.80,
        population: 100,
        iterations: 100
    });
    
    let genetic_team = genetic.select();
    
    //console.log(`[Genetic] Genetic algorithm executed in ${genetic.time}ms`);
    //console.log('[Genetic] Fitness:', genetic.metrics.fitness);
    //console.log('[Genetic] Iterations:', genetic.iterations.length);

    res.send(genetic_team)
});