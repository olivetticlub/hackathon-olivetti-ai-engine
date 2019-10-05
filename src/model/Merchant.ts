export interface Merchant
{
    id: number;
    ateco: number;
    lat: number;
    lng: number;
    coupons: number;
    owner: number;
    city: number;
    capability: number;
    sort: Function;
}
