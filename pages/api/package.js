import { promises as fs } from 'fs';
import path from 'path';
import { getProjectRoot } from '../../src/utils/getProjectRoot';

export default async function handler(req, res) {
  try {
    const projectRoot = getProjectRoot();
    const packagePath = path.join(projectRoot, 'package.json');
    const packageJson = await fs.readFile(packagePath, 'utf-8');
    res.status(200).json(JSON.parse(packageJson));
  } catch (error) {
    res.status(500).json({
      error: 'Failed to read package.json',
      details: error.message,
    });
  }
}
