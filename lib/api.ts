import { ApiResponse, ResultCode } from "@/types/auth";
import { getAccessToken } from "./utils";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  response: ApiResponse;

  constructor(response: ApiResponse) {
    super(response.message);
    this.response = response;
  }
}

type FetcherOptions = RequestInit & { auth?: boolean };

export async function fetcher<T>(endpoint: string, options: FetcherOptions = {}): Promise<T> {
  const { auth = true, headers = {}, ...restOptions } = options;

  const finalHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (auth) {
    const token = getAccessToken();
    if (token) {
      (finalHeaders as any)["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: finalHeaders,
    ...restOptions,
  });

  const responseBody: ApiResponse<T> = await res.json();

  // ResultCode 패턴:
  // S - Success (정상 처리)
  // B - Business (비즈니스 로직 분기, 정상 응답으로 처리)
  // G - Global Error
  // A - Auth Error
  // U - User Error
  // ST - StudyGroup Error
  // STM - StudyGroupMember Error

  // const code = responseBody.code;
  // const isError = code.startsWith("G") || code.startsWith("A") || code.startsWith("U") ||
  //   code.startsWith("ST") || code.startsWith("E");

  // if (!res.ok || isError) {
  //   throw new ApiError(responseBody);
  // }

  // // 비즈니스 로직 분기 코드는 정상 응답이지만 로깅
  // if (code.startsWith("B")) {
  //   console.log(`Business Logic: ${code} - ${responseBody.message}`);
  // }

  return responseBody.data;
}