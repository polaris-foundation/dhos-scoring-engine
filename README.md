# dhos-scoring-engine

A node package used to provide a 'score' response to incoming observation data. Returns scores for:

- Blood Glucose Readings
- NEWS2 Observation sets
- MEOWS Observation sets

# Running Tests

```bash
yarn install
yarn build
yarn test
```

# Important

The scoring engine is exposed through gemfury as an importable package so that the [dhos-rules-engine](https://github.com/draysontechnologies/dhos-rules-engine), [send-desktop](https://github.com/draysontechnologies/send-desktop) and [send-entry](https://github.com/draysontechnologies/send-entry) all import the same module for scoring. If the dhos-scoring-enine version is updated all of these repositories need to be updated so that the backend and frontend are in sync.
