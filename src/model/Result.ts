export interface Result
{
    genetic: {
        mutation_probability: number;
        crossover_probability: number;
        population: number;
        fitness: number;
        time: number;
        is_same_time: boolean;
    }
}