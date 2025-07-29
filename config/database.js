import dotenv from "dotenv";
import { PrismaClient } from "../node_modules/.prisma/client";

dotenv.config();

const db = new PrismaClient();

export default db;
