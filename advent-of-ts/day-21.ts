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

type GetUnused<
  Scope extends { declared: string[]; used: string[] },
  Parsed extends (
    | { type: "VariableDeclaration"; id: string }
    | { type: "CallExpression"; argument: string }
  )[],
  Result extends string[] = []
> = Parsed extends [
  infer First,
  ...infer Rest extends (
    | { type: "VariableDeclaration"; id: string }
    | { type: "CallExpression"; argument: string }
  )[]
]
  ? First extends { type: "VariableDeclaration"; id: string }
    ? First["id"] extends Scope["used"][number]
      ? GetUnused<Scope, Rest, Result>
      : GetUnused<Scope, Rest, [...Result, First["id"]]>
    : First extends { type: "CallExpression"; argument: string }
    ? First["argument"] extends Scope["used"][number]
      ? GetUnused<Scope, Rest, Result>
      : GetUnused<Scope, Rest, [...Result, First["argument"]]>
    : never
  : Result;

type Lint<T extends string> = {
  scope: GetResult<Parse<T>>;
  unused: GetUnused<GetResult<Parse<T>>, Parse<T>>;
};

import type { Expect, Equal } from "npm:type-testing";

type t0_actual = Lint<`
let teddyBear = "standard_model";
`>;
type t0_expected = {
  scope: { declared: ["teddyBear"]; used: [] };
  unused: ["teddyBear"];
};
type t0 = Expect<Equal<t0_actual, t0_expected>>;

type t1_actual = Lint<`
buildToy(teddyBear);
`>;
type t1_expected = {
  scope: { declared: []; used: ["teddyBear"] };
  unused: [];
};
type t1 = Expect<Equal<t1_actual, t1_expected>>;

type t2_actual = Lint<`
let robotDog = "deluxe_model";
assembleToy(robotDog);
`>;
type t2_expected = {
  scope: { declared: ["robotDog"]; used: ["robotDog"] };
  unused: [];
};
type t2 = Expect<Equal<t2_actual, t2_expected>>;

type t3_actual = Lint<`
let robotDog = "standard_model";
  const giftBox = "premium_wrap";
    var ribbon123 = "silk";
  
  \t
  wrapGift(giftBox);
  \r\n
      addRibbon(ribbon123);
`>;
type t3_expected = {
  scope: {
    declared: ["robotDog", "giftBox", "ribbon123"];
    used: ["giftBox", "ribbon123"];
  };
  unused: ["robotDog"];
};
type t3 = Expect<Equal<t3_actual, t3_expected>>;

type t4_actual = Lint<"\n\t\r \t\r ">;
type t4_expected = {
  scope: { declared: []; used: [] };
  unused: [];
};
type t4 = Expect<Equal<t4_actual, t4_expected>>;
