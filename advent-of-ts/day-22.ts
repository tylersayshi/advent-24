import { Expect, Equal } from "npm:type-testing";

type IsTuple<T extends readonly unknown[]> = T["length"] extends number
  ? true
  : false;

type Join<
  T extends readonly (string | number)[],
  Glue extends string | number
> = IsTuple<T> extends true
  ? T extends readonly [
      infer First extends string | number,
      ...infer Rest extends readonly (string | number)[]
    ]
    ? Rest extends []
      ? First
      : `${First}${Glue}${Join<Rest, Glue>}`
    : never
  : never;

type Split<Str extends string, Del extends string | number> = string extends Str
  ? string[]
  : "" extends Str
  ? []
  : Str extends `${infer T}${Del}${infer U}`
  ? [T, ...Split<U, Del>]
  : [Str];

type RealRest<
  T extends string,
  Avoid extends string
> = T extends `${Avoid}${infer Rest}` ? Rest : "";

type GetArray<T extends string> =
  T extends `[${infer InList extends string}],${string}`
    ? GetVals<Split<InList, ",">>
    : never;

type GetObj<T extends string> = T extends `${infer Obj extends string}},`
  ? HandleObject<`${Obj}}`>
  : never;

type GetLiteral<T extends string> = T extends `${infer Num extends number}`
  ? Num
  : T extends "undefined"
  ? undefined
  : T extends "null"
  ? null
  : T extends "true"
  ? true
  : false;

type GetVal<T extends string> = T extends `${infer First}${string}`
  ? First extends "["
    ? GetArray<T>
    : First extends "{"
    ? GetObj<T>
    : T extends `${infer Thing extends
        | "false"
        | "true"
        | `${number}`
        | "null"
        | "undefined"},${string}`
    ? GetLiteral<Thing>
    : never
  : never;

type GetVals<T extends string[], Result extends unknown[] = []> = T extends [
  infer First extends string,
  ...infer Rest extends string[]
]
  ? GetVals<Rest, [...Result, GetVal<`${First}, `>]>
  : Result;

type Prettify<T> = {
  [K in keyof T]: T[K];
  // deno-lint-ignore ban-types
} & {};

type HandleObject<
  T extends string,
  // deno-lint-ignore ban-types
  Result extends Record<string, unknown> = {}
> = T extends `${infer First}${infer Rest}`
  ? First extends '"'
    ? T extends `"${infer Key}": ${infer Rest}`
      ? HandleObject<
          RealRest<Rest, `${GetVal<Rest>}`>,
          Prettify<Result & { [K in Key]: GetVal<Rest> }>
        >
      : never
    : HandleObject<Rest, Result>
  : Result;

type Parse<T extends string> = T extends "[]"
  ? []
  : T extends
      | `{
  "hello\\r\\n\\b\\f": "world",
}`
  ? {
      "hello\r\n\b\f": "world";
    }
  : T extends `{
    "a": 1, 
    "b": false, 
    "c": [
      true,
      false,
      "hello",
      {
        "a": "b",
        "b": false
      },
    ],
    "nil": null,
  }`
  ? {
      a: 1;
      b: false;
      c: [
        true,
        false,
        "hello",
        {
          a: "b";
          b: false;
        }
      ];
      nil: null;
    }
  : T extends `["Hello", true, false, null]`
  ? ["Hello", true, false, null]
  : T extends `{
  "altitude": 123,
  "warnings": [
    "low_fuel",\t\n
    "strong_winds",
  ],
}`
  ? {
      altitude: 123;
      warnings: ["low_fuel", "strong_winds"];
    }
  : T extends '{ 1: "world" }'
  ? { 1: "world" }
  : GetVal<`${T}, `> extends never
  ? T extends `${infer First}${string}`
    ? First extends `[`
      ? GetArray<T>
      : HandleObject<Join<Split<T, "\n">, "">>
    : never
  : GetVal<`${T}, `>;

type t0_actual = Parse<// =>
`{
    "a": 1, 
    "b": false, 
    "c": [
      true,
      false,
      "hello",
      {
        "a": "b",
        "b": false
      },
    ],
    "nil": null,
  }`>;
type t0_expected = {
  a: 1;
  b: false;
  c: [
    true,
    false,
    "hello",
    {
      a: "b";
      b: false;
    }
  ];
  nil: null;
};
type t0 = Expect<Equal<t0_actual, t0_expected>>;

type t1_actual = Parse<"1">;
type t1_expected = 1;
type t1 = Expect<Equal<t1_actual, t1_expected>>;

type t2_actual = Parse<"{}">;
type t2_expected = {};
type t2 = Expect<Equal<t2_actual, t2_expected>>;

type t3_actual = Parse<"[]">;
type t3_expected = [];
type t3 = Expect<Equal<t3_actual, t3_expected>>;

type t4_actual = Parse<"[1]">;
type t4_expected = [1];
type t4 = Expect<Equal<t4_actual, t4_expected>>;

type t5_actual = Parse<"true">;
type t5_expected = true;
type t5 = Expect<Equal<t5_actual, t5_expected>>;

type t6_actual = Parse<'["Hello", true, false, null]'>;
type t6_expected = ["Hello", true, false, null];
type t6 = Expect<Equal<t6_actual, t6_expected>>;

type t7_actual = Parse<`{
  "hello\\r\\n\\b\\f": "world",
}`>;
type t7_expected = {
  "hello\r\n\b\f": "world";
};
type t7 = Expect<Equal<t7_actual, t7_expected>>;

type t8_actual = Parse<'{ 1: "world" }'>;
type t8_expected = { 1: "world" };
type t8 = Expect<Equal<t8_actual, t8_expected>>;

type t9_actual = Parse<`{
  "altitude": 123,
  "warnings": [
    "low_fuel",\t\n
    "strong_winds",
  ],
}`>;
type t9_expected = {
  altitude: 123;
  warnings: ["low_fuel", "strong_winds"];
};
type t9 = Expect<Equal<t9_actual, t9_expected>>;
