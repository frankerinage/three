import { config } from './config';

export default class Helpers {
  private constructor() {} // Prevent instantiation

  /**
   * Get the base URL from the app config.
   */
  static getBaseUrl(): string {
    return config.app.baseUrl;
  }

  /**
   * Construct the full URL for a 3D asset.
   * @param path The path to the 3D asset.
   */
  static get3DUrl(path: string): string {
    return `${Helpers.getBaseUrl()}/3d/${path}`;
  }

  /**
   * Construct the full URL for a general asset.
   * @param path The asset path.
   */
  static getAssetUrl(path: string): string {
    return `${Helpers.getBaseUrl()}${path}`;
  }
}
