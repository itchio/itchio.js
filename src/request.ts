import { ajax, RequestParameters } from "nanoajax";

export type RequestResult = {
  statusCode: number;
  responseText: string;
  request: XMLHttpRequest;
};

export default async function request(
  params: RequestParameters,
): Promise<RequestResult> {
  return new Promise<RequestResult>((resolve, reject) => {
    ajax(params, (statusCode, responseText, request) => {
      resolve({ statusCode, responseText, request });
    });
  });
}
