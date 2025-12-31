import jsonServer from "json-server";
import path from "path";
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Trỏ vào products.json
const dbPath = path.join(__dirname, '../db_json/products.json');

const router = jsonServer.router(dbPath);

export default router;