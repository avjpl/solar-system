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
    uri: 'mongodb+srv://avjplmongodb:8V7EHcpmQTJWNgQa@kloud0.wwijl.mongodb.net/?retryWrites=true&w=majority&appName=Kloud0',
    dbName: 'datasets',
    username: 'avjplmongodb',
    password: '8V7EHcpmQTJWNgQa',
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
