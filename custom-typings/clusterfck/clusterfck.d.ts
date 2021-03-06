/** Declaration file generated by dts-gen */

export class Kmeans {
    constructor(centroids: any);
    classify(point: any, distance: any): any;
    cluster(points: any, k: any, distance: any, snapshotPeriod: any, snapshotCb: any): any;
    fromJSON(json: any): any;
    randomCentroids(points: any, k: any): any;
    toJSON(): any;
    static kmeans(vectors: any, k: any): any;
}
export function hcluster(items: any, distance: any, linkage: any, threshold: any, snapshot: any, snapshotCallback: any): any;
export function kmeans(vectors: any, k: any): any;
