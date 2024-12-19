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

import type { Expect, Equal } from "npm:type-testing";

type t0_actual = Parse<`
let teddyBear = "standard_model";
`>;
type t0_expected = [
  {
    id: "teddyBear";
    type: "VariableDeclaration";
  }
];
type t0 = Expect<Equal<t0_actual, t0_expected>>;

type t1_actual = Parse<`
buildToy(teddyBear);
`>;
type t1_expected = [
  {
    argument: "teddyBear";
    type: "CallExpression";
  }
];
type t1 = Expect<Equal<t1_actual, t1_expected>>;

type t2_actual = Parse<`
let robotDog = "deluxe_model";
assembleToy(robotDog);
`>;
type t2_expected = [
  {
    id: "robotDog";
    type: "VariableDeclaration";
  },
  {
    argument: "robotDog";
    type: "CallExpression";
  }
];
type t2 = Expect<Equal<t2_actual, t2_expected>>;

type t3_actual = Parse<`
  const giftBox = "premium_wrap";
    var ribbon123 = "silk";
  
  \t
  wrapGift(giftBox);
  \r\n
      addRibbon(ribbon123);
`>;
type t3_expected = [
  {
    id: "giftBox";
    type: "VariableDeclaration";
  },
  {
    id: "ribbon123";
    type: "VariableDeclaration";
  },
  {
    argument: "giftBox";
    type: "CallExpression";
  },
  {
    argument: "ribbon123";
    type: "CallExpression";
  }
];
type t3 = Expect<Equal<t3_actual, t3_expected>>;

type t4_input = "\n\t\r \t\r ";
type t4_actual = Parse<t4_input>;
type t4_expected = [];
type t4 = Expect<Equal<t4_actual, t4_expected>>;
