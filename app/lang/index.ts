import en from "./en";
import ka from "./ka";
import ru from "./ru";

export const content = {
  en,
  ka,
  ru,
};

export type Lang = keyof typeof content;
export type Translation = typeof en;