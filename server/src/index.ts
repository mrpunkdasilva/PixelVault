import express from 'express';
import cors from 'cors';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { routes } from './presentation';

const app = express();
const PORT = process.env.PORT || 3001;

// Swagger setup
const swaggerDocument = YAML.load(path.join(__dirname, '..', 'swagger', 'openapi.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cors());
app.use(express.json());

const UPLOADS_DIR = process.env.UPLOADS_PATH || path.join(__dirname, '..', 'uploads');

// Serve static image files from 'uploads' directory
app.use('/uploads', express.static(UPLOADS_DIR));

app.get('/', (req, res) => {
  res.send('PixelVault Backend is running!');
});

app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
