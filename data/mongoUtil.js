import { MongoClient } from 'mongodb';

class MongoUtil {
  #uri;
  #dbName;
  #username;
  #password;
  #client;
  #db;
  #connected = false;

  constructor({ uri, dbName, username, password }) {
    this.#uri = uri;
    this.#dbName = dbName;
    this.#username = username;
    this.#password = password;
    this.#client = new MongoClient(this.#uri);
  }

  async #connect() {
    if (!this.#connected) {
      await this.#client.connect();

      this.#db = this.#client.db(this.#dbName);
      this.#connected = true;
    }
  }

  async getCollection(collectionName) {
    await this.#connect();

    return new Proxy(this.#db.collection(collectionName), {
      get: (collection, method) => {
        if (method === 'then') {
          return undefined;
        }

        if (typeof collection[method] === 'function') {
          return (...args) => {
            return Reflect.apply(collection[method], collection, args);
          };
        }

        throw new Error(`Method ${method} is not available on the MongoDB collection.`);
      },
    });
  }

  async close() {
    await this.#client.close();

    this.#connected = false;
  }
}

export default MongoUtil;
