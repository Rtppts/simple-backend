"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const pg_1 = require("pg");
const app = (0, express_1.default)();
const port = 3001;
const isProduction = process.env.NODE_ENV === 'production';
const pool = new pg_1.Pool(Object.assign({ connectionString: process.env.DATABASE_URL }, (isProduction && {
    ssl: { rejectUnauthorized: false },
})));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// ดึงชื่อทั้งหมด
app.get('/names', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query('SELECT * FROM names ORDER BY id');
    res.json(result.rows);
}));
// เพิ่มชื่อ
app.post('/names', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    yield pool.query('INSERT INTO names(name) VALUES($1)', [name]);
    res.sendStatus(200);
}));
// ลบชื่อ
app.delete('/names/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield pool.query('DELETE FROM names WHERE id = $1', [id]);
    res.sendStatus(200);
}));
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
