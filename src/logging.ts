import type {LoggingLevel} from "./loggingLevel";
import {canLog} from "./loggingLevel";

const browser = typeof window !== 'undefined'

const cssProperties = ['color', 'backgroundColor']
const cssTemplasteRuleRegex = /~((\w|-)+):(.+?);~/gm

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

const hexToRgb = (hex: string) => {
  hex = hex.slice(1)
  const parseIntSlice = (start: number, end: number) => parseInt(hex.slice(start, end), 16)
  return {
    r: parseIntSlice(0, 2),
    g: parseIntSlice(2, 4),
    b: parseIntSlice(4, 6),
  }
}

function color<T extends string, E extends string = T | `${T}Bg`>(name: T, hex: string): Record<E, string> {
  const result = (color: string, bg: string) => ({[name]: color, [`${name}Bg`]: bg}) as Record<E, string>
  if (browser) return result(`~color:${hex};~`, `~background-color:${hex}~`)
  if ('NOCOLOR' in process.env) return result('', '')
  const {r, g, b} = hexToRgb(hex)
  const code = (ansi: number) => `\x1b[${ansi};2;${r};${g};${b}m`
  return result(code(38), code(48))
}

function prop(name: string, value: string, nodeValue: string) {
  !cssProperties.includes(name) && cssProperties.push(name)
  return browser ? `~${name}:${value};~` : nodeValue
}

export function print(type: LoggingLevel, color: string, ...content: any[]) {
  if (type == 'none') return
  if (!canLog(type)) return
  const formattedDate = new Date().toLocaleString()
  const formattedContent = formatColors(`${white}${formattedDate} ${bold}${color}${capitalize(type)}.:${reset}`, ...content)
  return console[type](...formattedContent)
}

export function formatColors(...params: any[]): any[] {
  if (!browser) return params
  const css: string[] = []
  const replaced = params.join(' ').replace(cssTemplasteRuleRegex, (match) => {
    css.push(match.slice(1, -1))
    return '%c'
  })
  return [replaced, ...css]
}

export const
    {black, blackBg} = color('black', '#000000'),
    {red, redBg} = color('red', '#ff0000'),
    {redBright, redBrightBg} = color('redBright', '#ff5555'),
    {green, greenBg} = color('green', '#00ff00'),
    {yellow, yellowBg} = color('yellow', '#ffff00'),
    {yellowBright, yellowBrightBg} = color('yellowBright', '#FFEA00'),
    {blue, blueBg} = color('blue', '#0000ff'),
    {blueBright, blueBrightBg} = color('blueBright', '#0096FF'),
    {magenta, magentaBg} = color('magenta', '#ff00ff'),
    {cyan, cyanBg} = color('cyan', '#00ffff'),
    {white, whiteBg} = color('white', '#ffffff'),
    {gray, grayBg} = color('gray', '#808080'),

    reset = browser ? cssProperties.map(prop => `~${prop}:initial;~`).join('') : '\x1b[0m',
    bold = prop('font-weight', 'bold', '\x1b[1m'),
    dim = prop('filter', 'brightness(0.5)', '\x1b[2m'),
    italic = prop('font-style', 'italic', '\x1b[3m'),
    underline = prop('text-decoration', 'underline', '\x1b[4m'),
    inverse = prop('filter', 'invert(1)', '\x1b[7m'),
    hidden = prop('visibility', 'hidden', '\x1b[8m'),
    strikethrough = prop('text-decoration', 'line-through', '\x1b[9m'),
    visible = prop('visibility', 'visible', '\x1b[28m')