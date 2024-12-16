import type { Expect, Equal } from "npm:type-testing";

type GetHyphens<
  T extends string,
  Res extends 0[] = []
> = T extends `-${infer Rest}`
  ? GetHyphens<Rest, [0, ...Res]>
  : [T, Res["length"]];

type GetRoute<
  T extends string,
  CurrentWord extends string = "",
  Res extends [string, number][] = [],
  HyphenCount extends number = 0
> = T extends `${infer First}${infer Rest}`
  ? First extends "-"
    ? CurrentWord extends ""
      ? GetRoute<Rest, CurrentWord, Res, HyphenCount>
      : GetHyphens<T> extends [infer Remaining, infer Count]
      ? GetRoute<
          Remaining & string,
          "",
          [...Res, [CurrentWord, HyphenCount]],
          Count & number
        >
      : never
    : GetRoute<Rest, `${CurrentWord}${First}`, Res, HyphenCount>
  : CurrentWord extends ""
  ? Res
  : [...Res, [CurrentWord, HyphenCount]];

type t0_actual =
  GetRoute<"north_pole--candycane_forest----gumdrop_sea-------hawaii">; // =>
type t0_expected = [
  // =>
  ["north_pole", 0],
  ["candycane_forest", 2],
  ["gumdrop_sea", 4],
  ["hawaii", 7]
];
type t0 = Expect<Equal<t0_actual, t0_expected>>;

type t1_actual = GetRoute<"a-b-c-d">; // =>
type t1_expected = [
  // =>
  ["a", 0],
  ["b", 1],
  ["c", 1],
  ["d", 1]
];
type t1 = Expect<Equal<t1_actual, t1_expected>>;

type t2_actual = GetRoute<"🎅--🎄---🏠----🤶">; // =>
type t2_expected = [
  // =>
  ["🎅", 0],
  ["🎄", 2],
  ["🏠", 3],
  ["🤶", 4]
];
type t2 = Expect<Equal<t2_actual, t2_expected>>;

type t3_actual = GetRoute<"">; // =>
type t3_expected = []; // =>
type t3 = Expect<Equal<t3_actual, t3_expected>>;

type t4_actual = GetRoute<"north_pole">; // =>
type t4_expected = [["north_pole", 0]]; // =>
type t4 = Expect<Equal<t4_actual, t4_expected>>;

type t5_actual = GetRoute<"a--b----c-d---e">; // =>
type t5_expected = [
  // =>
  ["a", 0],
  ["b", 2],
  ["c", 4],
  ["d", 1],
  ["e", 3]
];
type t5 = Expect<Equal<t5_actual, t5_expected>>;

type t6_actual = GetRoute<"--a-b">; // =>
type t6_expected = [["a", 0], ["b", 1]]; // =>
type t6 = Expect<Equal<t6_actual, t6_expected>>;

type t7_actual = GetRoute<"a-b--">; // =>
type t7_expected = [["a", 0], ["b", 1]]; // =>
type t7 = Expect<Equal<t7_actual, t7_expected>>;

type t8_actual = GetRoute<"north pole-candy.cane">; // =>
type t8_expected = [["north pole", 0], ["candy.cane", 1]]; // =>
type t8 = Expect<Equal<t8_actual, t8_expected>>;

type t9_actual =
  GetRoute<"a--------------------------------------------------b">; // =>
type t9_expected = [["a", 0], ["b", 50]]; // =>
type t9 = Expect<Equal<t9_actual, t9_expected>>;

type t10_actual = GetRoute<"a--a-a---a">; // =>
type t10_expected = [["a", 0], ["a", 2], ["a", 1], ["a", 3]]; // =>
type t10 = Expect<Equal<t10_actual, t10_expected>>;

// @ts-expect-error should not be a generic array
type e0 = Expect<Equal<t0_actual, Array<[string, number]>>>;

// @ts-expect-error should only accept string input
type e1 = GetRoute<123>;
