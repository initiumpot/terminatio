import {blueBright, gray, print, redBright, yellowBright} from "./logging";

export const
    debug = (...params: any[]) => print('debug', gray, ...params),
    info = (...params: any[]) => print('info', blueBright, ...params),
    warn = (...params: any[]) => print('warn', yellowBright, ...params),
    error = (...params: any[]) => print('error', redBright, ...params),
    patchConsoleLogs = () => {
      console.debug = debug
      console.info = info
      console.warn = warn
      console.error = error
    }