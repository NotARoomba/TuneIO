import Crypto from "crypto-js";
import { STATUS_CODES, SpotifyTrack, User } from "./Types";
import YTSR, {Video} from "youtube-sr";

const API_URL = "https://tuneio-api.notaroomba.dev";

export async function callAPI(
  endpoint: string,
  method: string,
  body: object = {},
) {
  const time = Date.now().toString();
  const data = JSON.stringify(body);
  const digest = Crypto.enc.Hex.stringify(
    Crypto.HmacSHA256(
      time + method + endpoint + Crypto.MD5(data).toString(),
      Math.floor(Date.now() / (60 * 1000)).toString(),
    ),
  );
  const hmac = `HMAC ${time}:${digest}`;
  try {
    return method === "POST"
      ? await (
          await fetch(API_URL + endpoint, {
            method: method,
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: hmac,
            },
            body: JSON.stringify(body),
          })
        ).json()
      : await (
          await fetch(API_URL + endpoint, {
            method: method,
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: hmac,
            },
          })
        ).json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    if (!error.response) {
      // alert(
      //   "We couldn't connect to the server! Please check your internet connection.",
      // );
      return { status: STATUS_CODES.NO_CONNECTION };
    }
    return {
      status: STATUS_CODES.GENERIC_ERROR,
    };
  }
}
export async function checkIfLogin(): Promise<false | User> {
  const userID = getCookie("userID");
  if (!userID) return false;
  const validUser = await callAPI(`/users/${userID}`, "GET");
  if (validUser.status === STATUS_CODES.USER_NOT_FOUND) {
    setCookie("userID", null);
    return false;
  }
  return validUser.user;
}

export function convertToBase64(file: Blob) {
  return new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result as string);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}

export function setCookie(key: string, value: string | null) {
  const expires = new Date();
  expires.setTime(expires.getTime() + 365 * 24 * 60 * 60 * 1000);
  document.cookie = key + "=" + value + ";expires=" + expires.toUTCString();
}
export function deleteCookies() {
  document.cookie.split(";").forEach(function (c) {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
}
export function getCookie(key: string) {
  const keyValue = document.cookie.match("(^|;) ?" + key + "=([^;]*)(;|$)");
  return keyValue ? keyValue[2] : null;
}

export function isGoodMusicVideoContent(result: Video, song: SpotifyTrack) {
  const contains = (string: any, content: string) => !!~(string || "").indexOf(content);
  return ((result.music[0].title.toLowerCase() == song.name.toLowerCase() && result.music[0].artist.toLowerCase() == song.artists[0].name.toLowerCase()) || contains(result.channel?.name, "VEVO") || contains(result.channel?.name?.toLowerCase(), "official") || contains(result.title?.toLowerCase(), "official") || !contains(result.title?.toLowerCase(), "extended"));
}