import { readFile } from 'node:fs/promises';

import MongoUtil from './mongoUtil';

const datasets = [
  // 'employees',
  'planets',
  'bio',
  'movies',
  'test'
].map((file) => Promise.resolve(file));

const client = new MongoUtil(
  {
    uri: '',
    dbName: '',
    username: '',
    password: '',
  }
);

for await (const file of datasets) {
  // const data = file;
  const data = JSON.parse(await readFile('./data/' + file + '.json', 'utf8'));
  const collection = await client.getCollection(file);

  for (const payload of data) {
    await collection.insertOne(payload);
  }
}
