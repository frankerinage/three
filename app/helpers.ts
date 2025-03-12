import { config } from './config';

export const get3DUrl = (path: string) => {
  return config.app.baseUrl + '/3d/' + path;
};
