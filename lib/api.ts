import { get } from "http";
import { getAccessToken } from "./utils";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type FetcherOptions = RequestInit & { auth?: boolean };

export async function fetcher<T>(endpoint: string, options: FetcherOptions = {}): Promise<T> {
  // auth의 기본값을 true로 설정하여, 명시적으로 false를 주지 않는 한 토큰을 포함시킴
  const { auth = true, headers = {}, ...restOptions } = options;
  
  const finalHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (auth) {
    const token = getAccessToken();
    if (token) {
      (finalHeaders as any)["Authorization"] = `Bearer ${token}`;
    } else {
      // 토큰이 필요한 요청인데 토큰이 없다면?
      // 상황에 따라 여기서 바로 에러를 던지거나, 로그인을 유도할 수 있습니다.
      console.warn("인증 토큰이 필요한 요청이나 토큰이 없습니다.");
    }
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: finalHeaders,
    ...restOptions,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    console.error("API call failed:", res.status, errorBody);
    throw new Error(errorBody.message || "API call failed");
  }
  
  return res.json();
}