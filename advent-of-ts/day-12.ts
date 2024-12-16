type NaughtyOrNice<T extends string> = T extends "Yanni" | "Petra" | "Aagya"
  ? true
  : false;

type ToNumber<T extends string> = T extends `${infer N extends number}`
  ? N
  : never;

type GetName<T extends readonly [string, string, string]> = {
  name: T[0];
  count: ToNumber<T[2]>;
  rating: NaughtyOrNice<T[0]> extends true ? "nice" : "naughty";
};

type FormatNames<Names extends readonly [string, string, string][]> = {
  [K in keyof Names]: GetName<Names[K]>;
} & { length: Names["length"] };
