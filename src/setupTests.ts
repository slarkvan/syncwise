import { config } from 'dotenv';
import pathe from 'pathe';

config({
  path: pathe.resolve(__dirname, '../.env.local'),
});
