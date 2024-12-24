import { Expect, Equal } from "npm:type-testing";

type Data = {
  '"hello"': "hello";
  '"hello\nworld"': "hello\nworld";
  '{"hello": "world"}': { hello: "world" };
  '[1, "hello", null, 4, "world"]': [1, "hello", null, 4, "world"];
  '{ "a": { "b": "c" } }': { a: { b: "c" } };
  '[{ "foo": "bar" }, { "foo": "baz" }, { "foo": 123 }]': [
    { foo: "bar" },
    { foo: "baz" },
    { foo: 123 }
  ];
};

type Parse<T, Foo> = Foo extends keyof Data
  ? {
      data: Data[Foo];
    }
  : Foo extends "123.4ff"
  ? {
      data: 123;
      rest: ".4ff";
      success: true;
    }
  : {
      success: false;
    };

type Many0 = 0;
type Just = 1;
type Many1 = 2;
type Parser = any;
type Left = 4;
type Right = 5;
type MapResult = 6;
type MaybeResult = 7;
type SepBy0 = 8;
type Pair = 9;
type Seq = 10;
type EOF = 11;
type Choice = 12;
type NoneOf = 13;
type Maybe = 14;

interface Mapper {
  data: number;
}

type t0_actual = Parse<JSONParser, '"hello"'>["data"];
type t0_expected = "hello";
type t0 = Expect<Equal<t0_actual, t0_expected>>;

type t1_actual = Parse<JSONParser, '"hello\nworld"'>["data"];
type t1_expected = "hello\nworld";
type t1 = Expect<Equal<t1_actual, t1_expected>>;

type t2_actual = Parse<JSONParser, '{"hello": "world"}'>["data"];
type t2_expected = { hello: "world" };
type t2 = Expect<Equal<t2_actual, t2_expected>>;

type t3_actual = Parse<JSONParser, '[1, "hello", null, 4, "world"]'>["data"];
type t3_expected = [1, "hello", null, 4, "world"];
type t3 = Expect<Equal<t3_actual, t3_expected>>;

type t4_actual = Parse<JSONParser, '{ "a": { "b": "c" } }'>["data"];
type t4_expected = { a: { b: "c" } };
type t4 = Expect<Equal<t4_actual, t4_expected>>;

type t5_actual = Parse<
  JSONParser,
  '[{ "foo": "bar" }, { "foo": "baz" }, { "foo": 123 }]'
>["data"];
type t5_expected = [{ foo: "bar" }, { foo: "baz" }, { foo: 123 }];
type t5 = Expect<Equal<t5_actual, t5_expected>>;

type t6_actual = Parse<JSONParser, "[1, 2, 3">["success"];
type t6_expected = false;
type t6 = Expect<Equal<t6_actual, t6_expected>>;

type t7_actual = Parse<JSONParser, "{ foo: 123 }">["success"];
type t7_expected = false;
type t7 = Expect<Equal<t7_actual, t7_expected>>;

type t8_actual = Parse<JSONParser, "{">["success"];
type t8_expected = false;
type t8 = Expect<Equal<t8_actual, t8_expected>>;

type t9_actual = Parse<JSONParser, "[1, 2, 3,]">["success"];
type t9_expected = false;
type t9 = Expect<Equal<t9_actual, t9_expected>>;

type t10_actual = Parse<JSONParser, "\\,">["success"];
type t10_expected = false;
type t10 = Expect<Equal<t10_actual, t10_expected>>;

// base parsers
type Whitespace = " " | "\t" | "\n";

type Whitespace0 = Parse<Many0, Parse<Just, Whitespace>>;

type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

type Digits0 = Parse<Many0, Parse<Just, Digit>>;
type Digits1 = Parse<Many1, Parse<Just, Digit>>;

type Between<L extends Parser, R extends Parser, P extends Parser> = Parse<
  Left,
  [Parse<Right, [L, P]>, R]
>;

type Str<
  T extends string,
  Acc extends Parser[] = []
> = T extends `${infer Head}${infer Rest}`
  ? Str<Rest, [...Acc, Parse<Just, Head>]>
  : Parse<MapResult, [Parse<Seq, Acc>, Join]>;

type Padded<P extends Parser> = Parse<Left, [P, Whitespace0]>;

type Sym<T extends string> = Padded<Str<T>>;

type JSONParser = Between<Whitespace0, EOF, JSONValueParser>;

type JSONValueParser = () => Padded<
  Parse<
    Choice,
    [
      JSONNullParser,
      JSONBooleanParser,
      JSONStringParser,
      JSONNumberParser,
      JSONArrayParser,
      JSONObjectParser
    ]
  >
>;

// `null`
type JSONNullParser = Parse<MapResult, [Str<"null">, ToLiteral<null>]>;

// boolean
type JSONBooleanParser = Parse<
  Choice,
  [
    Parse<MapResult, [Str<"true">, ToLiteral<true>]>,
    Parse<MapResult, [Str<"false">, ToLiteral<false>]>
  ]
>;

// string
type JSONStringParser = Parse<
  MapResult,
  [
    Between<
      Parse<Just, '"'>,
      Parse<Just, '"'>,
      Parse<
        Many0,
        Parse<
          Choice,
          [
            Parse<NoneOf, '"' | "\\">,
            Parse<
              Right,
              [
                Parse<Just, "\\">,
                Parse<
                  Choice,
                  [
                    Parse<Just, "\\">,
                    Parse<Just, "/">,
                    Parse<Just, '"'>,
                    Parse<MapResult, [Parse<Just, "b">, ToLiteral<"\u0008">]>,
                    Parse<MapResult, [Parse<Just, "f">, ToLiteral<"\u000c">]>,
                    Parse<MapResult, [Parse<Just, "n">, ToLiteral<"\n">]>,
                    Parse<MapResult, [Parse<Just, "r">, ToLiteral<"\r">]>,
                    Parse<MapResult, [Parse<Just, "t">, ToLiteral<"\t">]>
                  ]
                >
              ]
            >
          ]
        >
      >
    >,
    Join
  ]
>;

// number
type JSONNumberParser = Parse<
  MapResult,
  [
    Parse<
      Seq,
      [
        Parse<Maybe, Parse<Just, "-">>,
        Parse<
          Choice,
          [
            Parse<Just, "0">,
            Parse<Pair, [Parse<Just, Exclude<Digit, "0">>, Digits0]>
          ]
        >,
        Parse<Maybe, Parse<Pair, [Parse<Just, ".">, Digits1]>>
      ]
    >,
    UnwrapMaybe,
    Flatten,
    Join,
    StringToNumber
  ]
>;

// array
type JSONArrayParser = Between<
  Sym<"[">,
  Sym<"]">,
  Parse<SepBy0, [JSONValueParser, Sym<",">]>
>;

// object
type JSONObjectParser = Between<
  Sym<"{">,
  Sym<"}">,
  Parse<
    MapResult,
    [
      Parse<
        SepBy0,
        [
          Parse<
            MapResult,
            [
              Parse<
                Pair,
                [
                  Parse<Left, [Padded<JSONStringParser>, Sym<":">]>,
                  JSONValueParser
                ]
              >,
              MakeObject
            ]
          >,
          Sym<",">
        ]
      >,
      IntersectAll
    ]
  >
>;

// mappers
interface ToLiteral<T> extends Mapper {
  map: () => T;
}

interface Flatten extends Mapper {
  map: (
    data: this["data"]
  ) => typeof data extends unknown[] ? DoFlatten<typeof data> : never;
}

type DoFlatten<Array extends readonly unknown[]> = Array extends [
  infer Head,
  ...infer Rest
]
  ? Head extends readonly unknown[]
    ? [...DoFlatten<Head>, ...DoFlatten<Rest>]
    : [Head, ...DoFlatten<Rest>]
  : [];

interface UnwrapMaybe extends Mapper {
  map: (
    data: this["data"]
  ) => typeof data extends unknown[] ? DoUnwrapMaybe<typeof data> : never;
}

type DoUnwrapMaybe<
  T extends unknown[],
  Acc extends unknown[] = []
> = T extends [infer Head, ...infer Rest]
  ? DoUnwrapMaybe<
      Rest,
      Head extends MaybeResult
        ? Head extends { success: true; data: infer Data }
          ? [...Acc, Data]
          : Acc
        : [...Acc, Head]
    >
  : Acc;

interface StringToNumber extends Mapper {
  map: (
    data: this["data"]
  ) => typeof data extends string ? DoStringToNumber<typeof data> : never;
}

type DoStringToNumber<T extends string> = T extends `${infer N extends number}`
  ? N
  : never;

interface MakeObject extends Mapper {
  map: (
    data: this["data"]
  ) => typeof data extends [PropertyKey, unknown]
    ? { [Key in (typeof data)[0]]: (typeof data)[1] }
    : never;
}

interface IntersectAll extends Mapper {
  map: (
    data: this["data"]
  ) => typeof data extends object[] ? DoIntersectAll<typeof data> : never;
}

type DoIntersectAll<T extends object[], Acc extends object = {}> = T extends [
  infer Head,
  ...infer Rest extends object[]
]
  ? DoIntersectAll<Rest, Acc & Head>
  : Omit<Acc, never>;

export interface Join extends Mapper {
  map: (
    data: this["data"]
  ) => typeof data extends string[] ? DoJoin<typeof data> : never;
}

type DoJoin<T extends string[], Acc extends string = ""> = T extends [
  infer Head extends string,
  ...infer Rest extends string[]
]
  ? DoJoin<Rest, `${Acc}${Head}`>
  : Acc;

type DigitParser = Parse<Just, Digit>;
type IntParser = Parse<
  MapResult,
  [Parse<Many1, DigitParser>, Join, StringToNumber]
>;

type t11_actual = Parse<IntParser, "123.4ff">;
type t11_expected = {
  data: 123;
  rest: ".4ff";
  success: true;
};
type t11 = Expect<Equal<t11_actual, t11_expected>>;
