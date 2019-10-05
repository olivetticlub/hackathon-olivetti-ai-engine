![logo](https://i.imgur.com/CNnILmD.png)

# OlivettiClub AI engine

A proof of concept for the AI engine that will drive the distribution of coupons
to members of the OlivettiClub network.

The OlivettiClub network matches merchants with other merchants to allow them to exchange coupons.
The goal of this AI is to optimize this matchmaking, in order to improve the conversion rate while
also ensuring that merchants will not accidentally push their customers towards their competitors.

The AI is implemented as a genetic algorithm that relies on information about the location and
economic category of the merchant to determine the optimal neighborhood from which to obtain coupons.

It is easy to extend the engine with additional information, to further optimize its effectiveness.
Some potential info that could be considered are the time of the day (e.g., to distribute 
restaurant's coupons around meal times) and the history of coupons exchange between different stores.

## Usage

Setup

```bash
npm install
```

Start the server

```bash
npm start
```

To learn about the available Api to interact with this service, refer to the `sample.sh` script.

