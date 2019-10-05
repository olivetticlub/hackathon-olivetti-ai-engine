import {Merchant} from '../model/Merchant';
import {Team} from '../model/Team';

export interface Element {
    fitness: number;
    team: Team;
}
export type Population = Element[];

export interface GeneticOptions
{
    mutation_probability: number;
    crossover_probability: number;
    population: number
    iterations: number
}

export default class Genetic
{
    private _merchant: Merchant;
    private _training_set: Merchant[];
    private _team_size: number;
    private _dispersion: (merchant: Merchant, team: Team) => number;
    private _fitness: (merchant: Merchant, team: Team) => number;
    private _options: GeneticOptions;
    private _time: number;
    private _fitness_sum: number;
    private _iterations: number[] = [];

    /**
     *
     * @param training_set
     * @param team_size
     * @param dispersion
     * @param fitness
     * @param options
     */
    public constructor(merchant: Merchant, training_set: Merchant[], team_size: number, dispersion: (merchant: Merchant, team: Team) => number, fitness: (merchant: Merchant, team: Team) => number, options: GeneticOptions)
    {
        this._merchant = merchant;
        this._training_set = training_set;
        this._team_size = team_size;
        this._dispersion = dispersion;
        this._fitness = fitness;
        this._options = options;
    }

    /**
     *
     * @returns {Team}
     */
    public select(): Team
    {
        let start_selection = Date.now();
        let population = this._init();
        population = population.sort((element: Element, other_element: Element) =>
        {
            return other_element.fitness - element.fitness;
        });
        let iteration = 0;
        let actual_time = 0;
        while(iteration < this._options.iterations)
        {
            population = this._selection(population);
            population = this._crossover(population);
            population = this._mutate(population);

            population = population.sort((element: Element, other_element: Element) =>
            {
                return other_element.fitness - element.fitness;
            });

            this._iterations.push(population[0].fitness);

            iteration++;

            actual_time = Date.now() - start_selection;
        }

        this._time = Date.now() - start_selection;

        return population[0].team;
    }

    // region getters

    public get time(): number
    {
        return this._time;
    }

    public get iterations(): number[]
    {
        return this._iterations;
    }

    // endregion

    // region genetic

    /**
     *
     * @returns {Array}
     * @private
     */
    private _init(): Population
    {
        let population = [];
        this._fitness_sum = (this._options.population + 1) * this._options.population / 2;
        for(let i = 0; i < this._options.population; i++)
        {
            let team = [];
            for(let j = 0; j < this._team_size; j++)
            {
                let merchant_index = Math.floor(Math.random() * this._training_set.length);
                while(team.indexOf(merchant_index) !== -1)
                    merchant_index = Math.floor(Math.random() * this._training_set.length);

                team.push(merchant_index);
            }
            population.push({fitness: this._fitness(this._merchant, this._team_from_array(team)), team: this._team_from_array(team)});
        }
        return population;
    }

    /**
     *
     * @param population
     * @returns {Population}
     * @private
     */
    private _selection(population: Population): Population
    {
        let new_population: Population = [];

        for(let i = 0; i < this._options.population; i++)
        {
            let fitness_rand = Math.random() * this._fitness_sum;
            let fitness_count = 0;
            let count = 0;
            while(fitness_count <= fitness_rand && count < this._options.population)
            {
                if((this._options.population - count) + fitness_count >= fitness_rand)
                {
                    let new_team = population[count].team;
                    new_population.push({fitness: this._fitness(this._merchant, new_team), team: new_team})
                }

                fitness_count += (this._options.population - count);
                count++;
            }

        }
        return new_population;
    }

    /**
     *
     * @param team
     * @returns {Team}
     * @private
     */
    private _mutate(population: Population): Population
    {
        let new_population: Population = [];
        for(let i = 0; i < this._options.population; i++)
        {
            let team = population[i].team;
            for (let i = 0; i < this._team_size; i++)
            {
                let rand = Math.random();

                if (rand < this._options.mutation_probability)
                {
                    let duplicate: boolean = true;
                    while (duplicate)
                    {
                        let merchant_index = Math.floor(Math.random() * this._training_set.length);
                        let j = 0;
                        while (j < this._team_size && team[j].id !== this._training_set[merchant_index].id) j++;
                        if (j >= this._team_size)
                        {
                            duplicate = false;
                            team[i] = this._training_set[merchant_index];
                        }
                    }
                }
            }
            new_population.push({fitness: this._fitness(this._merchant, team), team: team});
        }
        return new_population;
    }

    /**
     *
     * @param population
     * @returns {Population}
     * @private
     */
    private _crossover(population: Population): Population
    {
        let new_population: Population = [];
        for(let i = 0; i < this._options.population / 2; i++)
        {
            let rand = Math.floor(Math.random()*population.length);
            let first = population.splice(rand, 1)[0].team;

            rand = Math.floor(Math.random()*population.length);
            let second = population.splice(rand, 1)[0].team;

            if(Math.random() <= this._options.crossover_probability)
                [first, second] = this._cross(first, second);

            new_population.push({team: first, fitness: this._fitness(this._merchant, first)});
            new_population.push({team: second, fitness: this._fitness(this._merchant, second)});
        }
        return new_population;
    }

    /**
     *
     * @param team1
     * @param team2
     * @returns {[Team,Team]}
     * @private
     */
    private _cross(team1: Team, team2: Team): [Team, Team]
    {
        let new_teams: Team[] = [];
        new_teams[0] = [];
        new_teams[1] = [];
        let temp_team: Team = [];

        for(let i = 0; i < this._team_size; i++)
            new_teams[i % 2].push(team1[i]);

        for(let i = 0; i < this._team_size; i++)
        {
            let duplicate: boolean = false;
            for(let j = 0; !duplicate && j < this._team_size / 2; j++)
            {
                if(new_teams[0][j].id === team2[i].id)
                {
                    duplicate = true;
                    new_teams[1].push(team2[i]);
                }
                if(!duplicate && new_teams[1][j].id === team2[i].id)
                {
                    duplicate = true;
                    new_teams[0].push(team2[i]);
                }
            }

            if(!duplicate)
                temp_team.push(team2[i]);
        }

        for(let i = 0; i < temp_team.length; i++)
        {
            if(new_teams[0].length < this._team_size)
                new_teams[0].push(temp_team[i]);
            else
                new_teams[1].push(temp_team[i]);
        }

        return [new_teams[0], new_teams[1]];
    }

    /**
     *
     * @param array
     * @returns {Team}
     * @private
     */
    private _team_from_array(array: number[]): Team
    {
        let team: Team = [];
        for(let i in array)
            team.push(this._training_set[array[i]]);
        return team;
    }

    private _array_from_team(team: Team): number[]
    {
        let array: number[] = [];
        for(let i in team)
            array.push(team[i].id);
        return array;
    }
}
