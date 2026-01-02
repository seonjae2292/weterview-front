import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { setCookie, getCookie, deleteCookie } from "cookies-next"

const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

const getAccessToken = () => {
  return getCookie("accessToken");
}

const getRefreshToken = () => {
  return getCookie("refreshToken");
}

const setTokens = (accessToken: string, refreshToken: string) => {
  setCookie("accessToken", accessToken, { maxAge: 60 * 60, path: "/" }); // 1 hour
  setCookie("refreshToken", refreshToken, { maxAge: 60 * 60 * 24 * 7, path: "/" }); // 7 days
}

const deleteTokens = () => {
  deleteCookie("accessToken", { path: "/" });
  deleteCookie("refreshToken", { path: "/" });
}

export { cn, getAccessToken, getRefreshToken, setTokens, deleteTokens };
