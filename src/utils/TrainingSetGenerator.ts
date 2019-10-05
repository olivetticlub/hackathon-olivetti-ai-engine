import {Merchant} from '../model/Merchant';
const random_weighted = require('random-weighted-choice');
import * as fs from 'fs-extra';
// import * as gaussian from 'gaussian';

export default class TrainingSetGenerator
{
    private _input: string;
    private _output: string;
    private _time: number;

    constructor(input: string, output: string)
    {
        if(!fs.existsSync(input))
            throw new Error(`Input path ${input} does not exists`);

        this._input = input;
        this._output = output;
    }

    public generate(max_merchants_per_city: number, save: boolean = true): Merchant[]
    {
        let start_generation = Date.now();
        let cities = require(this._input);
        let ts: Merchant[] = [];

        let id = 0;
        for(let i = 0; i < cities.length; i++)
        {
            let merchants_per_city = Math.floor(cities[i].pop * max_merchants_per_city / 2500000) + 1;
            cities[i].start = id;
            cities[i].end = id + merchants_per_city;
            id += merchants_per_city;
        }

        cities.map((city) =>
        {
            for(let i = city.start; i < city.end; i++)
            {
                let capability = (Math.random() * 100);
                let ateco = Math.floor((Math.random() * 10));
                let merchant: Merchant = {
                    city : city.city,
                    lat : city.lat,
                    lng : city.lng,

                    ateco: ateco,
                    owner : i,
                    id : i,
                    capability : capability / 100,
                    coupons : (Math.random() * capability) / 100,
                    sort: null
                };
                ts.push(merchant);
            }

        });

        if(save)
            fs.writeFileSync(this._output, JSON.stringify(ts));

        this._time = Date.now() - start_generation;
        return ts;
    }

    // region getters
    public get time(): number
    {
        return this._time;
    }
    // endregion
}