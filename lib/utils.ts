import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { setCookie, getCookie, deleteCookie } from "cookies-next"

const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

const getAccessToken = () => {
  return getCookie("accessToken");
}

const setTokens = (accessToken: string) => {
  setCookie("accessToken", accessToken, { maxAge: 60 * 60, path: "/" }); // 1 hour
}

const deleteTokens = () => {
  deleteCookie("accessToken", { path: "/" });
}

export { cn, getAccessToken, setTokens, deleteTokens };
