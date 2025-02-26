import { dbConnection } from "./mongoConnection.js";

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

// Note: You will need to change the code below!
// export const products = getCollectionFn("products");
// const users = getCollectionFn("users");
// export default getCollectionFn;

export const users = getCollectionFn('users')
export const institutions = getCollectionFn('institutions')
export const pets = getCollectionFn('pets')


