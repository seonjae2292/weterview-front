import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { setCookie, getCookie, deleteCookie } from "cookies-next"

const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

const getAccessToken = () => {
  if (!getCookie("accessToken")) {
    return undefined;
  }

  return getCookie("accessToken");
}

const setAccessToken = (accessToken: string) => {
  setCookie("accessToken", accessToken, { maxAge: 60 * 60, path: "/" });
}

const deleteAccessToken = () => {
  deleteCookie("accessToken", { path: "/" });
}

export { cn, getAccessToken, setAccessToken, deleteAccessToken };
