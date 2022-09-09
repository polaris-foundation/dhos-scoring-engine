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

The scoring engine is exposed through npm as an importable package so that the [polaris-rules-engine](https://github.com/polaris-foundation/polaris-rules-engine) can import the the scoring module.
