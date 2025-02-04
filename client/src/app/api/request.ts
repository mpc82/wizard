import Axios from 'axios';
import {Injectable} from 'react-ts-di';

import ServerConfig from '../.config/server-config.json';

import {useReq, useRes} from './@attach-interceptor';
import {getData, requestType} from './@interceptors';

interface ServerConfig {
  baseUrl: string;
  port: number;
  protocol: string;
  mode: string;
}

export const enum ContentType {
  Form = 'application/x-www-form-urlencoded',
}

const {baseUrl, port, protocol, mode} = ServerConfig as ServerConfig;

export interface PostPayload<T = unknown> {
  [index: string]: T;
}

useReq(requestType);
useRes(getData as any);

@Injectable()
export class HTTP {
  private addr: string;

  constructor() {
    this.addr = `${protocol}://${baseUrl}:${port === 80 ? '' : port}/${
      mode === 'dev' ? 'apis/' : ''
    }`;
  }

  get<R, T = {}>(path: string, data?: PostPayload<T>): R {
    return (Axios.get<R>(this.join(path), {
      params: {...data},
    }) as unknown) as R;
  }

  post<R, T = {}>(path: string, data?: T, contentType?: ContentType): R {
    return (Axios.post<R>(this.join(path), data || {}, {
      headers: {
        'Content-Type': contentType || ContentType.Form,
      },
    }) as unknown) as R;
  }

  private join(path: string): string {
    const parsedPath = path.replace(/^\/(.*)/, (_, cap) => cap);

    return `${this.addr}${parsedPath}`;
  }
}
