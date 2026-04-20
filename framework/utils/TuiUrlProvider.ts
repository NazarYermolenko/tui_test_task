import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export class TuiUrlProvider {
  /**
   * Returns the base URL from the .env file.
   * If not found, returns the default URL.
   */
  static getBaseUrl(): string {
    const url = process.env.BASE_URL;
    if (!url) {
      throw new Error('BASE_URL is not defined in the .env file');
    }
    return url;
  }
}
