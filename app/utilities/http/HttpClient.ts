// noinspection JSUnusedGlobalSymbols

import {authedFetch} from "@/app/utilities/http/authedFetch";
import {singleton} from "tsyringe";

export enum HttpStatusCode {
  Continue = 100,
  SwitchingProtocols = 101,
  Processing = 102,
  EarlyHints = 103,
  Ok = 200,
  Created = 201,
  Accepted = 202,
  NonAuthoritativeInformation = 203,
  NoContent = 204,
  ResetContent = 205,
  PartialContent = 206,
  MultiStatus = 207,
  AlreadyReported = 208,
  ImUsed = 226,
  MultipleChoices = 300,
  MovedPermanently = 301,
  Found = 302,
  SeeOther = 303,
  NotModified = 304,
  UseProxy = 305,
  Unused = 306,
  TemporaryRedirect = 307,
  PermanentRedirect = 308,
  BadRequest = 400,
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  NotAcceptable = 406,
  ProxyAuthenticationRequired = 407,
  RequestTimeout = 408,
  Conflict = 409,
  Gone = 410,
  LengthRequired = 411,
  PreconditionFailed = 412,
  PayloadTooLarge = 413,
  UriTooLong = 414,
  UnsupportedMediaType = 415,
  RangeNotSatisfiable = 416,
  ExpectationFailed = 417,
  ImATeapot = 418,
  MisdirectedRequest = 421,
  UnprocessableEntity = 422,
  Locked = 423,
  FailedDependency = 424,
  TooEarly = 425,
  UpgradeRequired = 426,
  PreconditionRequired = 428,
  TooManyRequests = 429,
  RequestHeaderFieldsTooLarge = 431,
  UnavailableForLegalReasons = 451,
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
  HttpVersionNotSupported = 505,
  VariantAlsoNegotiates = 506,
  InsufficientStorage = 507,
  LoopDetected = 508,
  NotExtended = 510,
  NetworkAuthenticationRequired = 511,
}

export enum HttpHeader {
  Accept = "Accept",
  ContentType = "Content-Type"
}

export interface StoryparkResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

export interface RequestConfig<D = any> {
  headers?: { [key in HttpHeader]?: string };
  data?: D;
  abort?: AbortController;
}

export interface HttpClient {
  get<T = any, R = StoryparkResponse<T>, D = never>(path: string, config?: RequestConfig<D>): Promise<R>;

  delete<T = any, R = StoryparkResponse<T>, D = never>(path: string, config?: RequestConfig<D>): Promise<R>;

  head<T = any, R = StoryparkResponse<T>, D = never>(path: string, config?: RequestConfig<D>): Promise<R>;

  options<T = any, R = StoryparkResponse<T>, D = never>(path: string, config?: RequestConfig<D>): Promise<R>;

  post<T = any, R = StoryparkResponse<T>, D = any>(path: string, data?: D, config?: RequestConfig<D>): Promise<R>;

  put<T = any, R = StoryparkResponse<T>, D = any>(path: string, data?: D, config?: RequestConfig<D>): Promise<R>;

  patch<T = any, R = StoryparkResponse<T>, D = any>(path: string, data?: D, config?: RequestConfig<D>): Promise<R>;
}

type FetchFunctionType = (
  input: RequestInfo,
  init?: RequestInit,
) => Promise<Response>

class DefaultHttpClient implements HttpClient {
  readonly defaultHeaders: { [key in HttpHeader]?: string }
  readonly fetchFunction: (
    input: RequestInfo,
    init?: RequestInit,
  ) => Promise<Response>

  constructor(fetchFunction: FetchFunctionType = fetch) {
    this.defaultHeaders = {
      [HttpHeader.Accept]: "application/json",
    }
    this.fetchFunction = fetchFunction
  }

  async request<T = any, R = StoryparkResponse<T>, D = any>(path: string, method: string, config?: RequestConfig<D>): Promise<R> {
    const requestInit: RequestInit = {
      headers: this.defaultHeaders,
      method: method
    }

    if (config) {
      const {headers, data, abort} = config

      if (data) {
        requestInit.headers = {
          ...requestInit.headers,
          [HttpHeader.ContentType]: "application/json",
        }
        requestInit.body = JSON.stringify(data)
      }

      if (headers) {
        requestInit.headers = {
          ...requestInit.headers,
          ...headers
        }
      }

      if (abort) {
        requestInit.signal = abort.signal
      }
    }

    const response: Response = await this.fetchFunction(path, requestInit)
    if (response.ok) {
      let responseData: T
      if (!response.body) {
        responseData = {} as T
      } else {
        responseData = await response.json() as T
      }

      // @ts-ignore
      return {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      } satisfies StoryparkResponse<T>
    } else {
      throw response
    }
  }

  async delete<T = any, R = StoryparkResponse<T>, D = never>(path: string, config?: RequestConfig<D>): Promise<R> {
    return await this.request(path, "DELETE", config)
  }

  async get<T = any, R = StoryparkResponse<T>, D = never>(path: string, config?: RequestConfig<D>): Promise<R> {
    return await this.request(path, "GET", config)
  }

  async head<T = any, R = StoryparkResponse<T>, D = never>(path: string, config?: RequestConfig<D>): Promise<R> {
    return await this.request(path, "HEAD", config)
  }

  async options<T = any, R = StoryparkResponse<T>, D = never>(path: string, config?: RequestConfig<D>): Promise<R> {
    return await this.request(path, "OPTIONS", config)
  }

  async patch<T = any, R = StoryparkResponse<T>, D = any>(path: string, data?: D, config?: RequestConfig<D>): Promise<R> {
    return await this.request(path, "PATCH", config)
  }

  async post<T = any, R = StoryparkResponse<T>, D = any>(path: string, data?: D, config?: RequestConfig<D>): Promise<R> {
    return await this.request(path, "POST", config)
  }

  async put<T = any, R = StoryparkResponse<T>, D = any>(path: string, data?: D, config?: RequestConfig<D>): Promise<R> {
    return await this.request(path, "PUT", config)
  }
}

@singleton()
export class AuthedHttpClient extends DefaultHttpClient {
  constructor() {
    super(authedFetch);
  }
}