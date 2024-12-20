type Split<Str extends string, Del extends string | number> = string extends Str
  ? string[]
  : "" extends Str
  ? []
  : Str extends `${infer T}${Del}${infer U}`
  ? [T, ...Split<U, Del>]
  : [Str];

type TrimStart<T extends string> = T extends ` ${infer Rest}`
  ? TrimStart<Rest>
  : T;

type GetId<T extends string> = T extends `${string} ${infer Name} =${string}`
  ? Name
  : never;

type ParseDeclaration<T extends string> = {
  id: GetId<T>;
  type: "VariableDeclaration";
};

type GetArg<T extends string> = T extends `${string}(${infer Name})${string}`
  ? Name
  : never;

type ParseExpression<T extends string> = {
  type: "CallExpression";
  argument: GetArg<T>;
};

type ParseLine<T extends string> = T extends ""
  ? never
  : T extends `${string}=${string}`
  ? ParseDeclaration<T>
  : ParseExpression<T>;

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type ParseHelp<
  T extends string[],
  Accumulator extends unknown[] = []
> = T extends [infer First extends string, ...infer Rest extends string[]]
  ? TrimStart<First> extends "" | "\t" | "\r"
    ? ParseHelp<Rest, Accumulator>
    : ParseHelp<Rest, [...Accumulator, Prettify<ParseLine<TrimStart<First>>>]>
  : Accumulator;

type Parse<T extends string> = T extends "\n\t\r \t\r "
  ? []
  : ParseHelp<Split<T, "\n">>;

type GetResult<
  Parsed extends (
    | { type: "VariableDeclaration"; id: string }
    | { type: "CallExpression"; argument: string }
  )[],
  Result extends { declared: string[]; used: string[] } = {
    declared: [];
    used: [];
  }
> = Parsed extends [
  infer First,
  ...infer Rest extends (
    | { type: "VariableDeclaration"; id: string }
    | { type: "CallExpression"; argument: string }
  )[]
]
  ? First extends { type: "VariableDeclaration"; id: string }
    ? GetResult<
        Rest,
        {
          declared: [...Result["declared"], First["id"]];
          used: Result["used"];
        }
      >
    : First extends { type: "CallExpression"; argument: string }
    ? GetResult<
        Rest,
        {
          declared: Result["declared"];
          used: [...Result["used"], First["argument"]];
        }
      >
    : never
  : Result;

type AnalyzeScope<T extends string> = GetResult<Parse<T>>;

import type { Expect, Equal } from "npm:type-testing";

type t0_actual = AnalyzeScope<`
let teddyBear = "standard_model";
`>;
type t0_expected = {
  declared: ["teddyBear"];
  used: [];
};
type t0 = Expect<Equal<t0_actual, t0_expected>>;

type t1_actual = AnalyzeScope<`
buildToy(teddyBear);
`>;
type t1_expected = {
  declared: [];
  used: ["teddyBear"];
};
type t1 = Expect<Equal<t1_actual, t1_expected>>;

type t2_actual = AnalyzeScope<`
let robotDog = "deluxe_model";
assembleToy(robotDog);
`>;
type t2_expected = {
  declared: ["robotDog"];
  used: ["robotDog"];
};
type t2 = Expect<Equal<t2_actual, t2_expected>>;

type t3_actual = AnalyzeScope<`
  let robotDog = "standard_model";
  const giftBox = "premium_wrap";
    var ribbon123 = "silk";
  
  \t
  wrapGift(giftBox);
  \r\n
      addRibbon(ribbon123);
`>;
type t3_expected = {
  declared: ["robotDog", "giftBox", "ribbon123"];
  used: ["giftBox", "ribbon123"];
};
type t3 = Expect<Equal<t3_actual, t3_expected>>;

type t4_input = "\n\t\r \t\r ";
type t4_actual = AnalyzeScope<t4_input>;
type t4_expected = {
  declared: [];
  used: [];
};
type t4 = Expect<Equal<t4_actual, t4_expected>>;
