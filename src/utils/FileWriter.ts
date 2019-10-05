import * as fs from 'fs';
import * as path from 'path';
import {Team} from '../model/Team';
import {Metrics} from '../model/Metrics';

export default class FileWriter
{
    private _simulation_path: string;
    public constructor(simulation_path: string)
    {
        if(!fs.existsSync(simulation_path))
            fs.mkdirSync(simulation_path);
        this._simulation_path = simulation_path;
    }

    public write_genetic_team(team: Team): void
    {
        fs.writeFileSync(path.resolve(this._simulation_path, 'genetic_team.json'), JSON.stringify(team));
        fs.writeFileSync(path.resolve(this._simulation_path, 'genetic_team.js'), 'var genetic_team =' + JSON.stringify(team) + ';');
    }

    public write_genetic_team_metrics(metrics: Metrics): void
    {
        fs.writeFileSync(path.resolve(this._simulation_path, 'genetic_team_metrics.json'), JSON.stringify(metrics));
    }
}
