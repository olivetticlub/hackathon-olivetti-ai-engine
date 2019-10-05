import {RankingOptions} from '../model/RankingOptions';
import {Team} from '../model/Team';
import {Merchant} from '../model/Merchant';
const haversine  = require('haversine');
const ranking_options: RankingOptions = require('../options.json').ranking;

/**
 *
 * @param team
 * @returns {number}
 */
export function dispersion(merchant: Merchant, team: Team): number
{
    let sum_of_haversine_distance = 0;
    let earth_semicirconference = 20027;
    for(let other_merchant of team)
    {
        sum_of_haversine_distance += haversine({
            latitude: merchant.lat,
            longitude: merchant.lng
        }, {
            latitude: other_merchant.lat,
            longitude: other_merchant.lng
        });
    }

    return 1/(((sum_of_haversine_distance / (team.length)) / earth_semicirconference));
}

export function diversity(merchant: Merchant, team: Team): number
{
    let diversity = 0;
    for(let other_merchant of team)
    {
        if(merchant.ateco != other_merchant.ateco)
            diversity++;
    }
    return diversity / team.length;
}

/**
 *
 * @param team
 * @returns {number}
 */
export function fitness(merchant: Merchant, team: Team): number
{
    //TODO use more informations
    return ranking_options.alfa_dispersion * dispersion(merchant, team) +
    ranking_options.alfa_diversity * diversity(merchant, team);
}
