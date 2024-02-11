import Pocketbase from 'pocketbase';
import dotenv from 'dotenv';
dotenv.config();

const pb = new Pocketbase(process.env.POCKETBASE_URL);

export default pb;