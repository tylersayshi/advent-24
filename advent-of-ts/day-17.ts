const compose =
  <A extends string, B, C, D>(f: (a: A) => B, g: (b: B) => C, h: (c: C) => D) =>
  (a: A): D =>
    h(g(f(a)));

type FirstChar<S extends string> = S extends `${infer First}${string}`
  ? First
  : never;
type FirstItem<Items extends readonly unknown[]> = Items extends readonly [
  infer First,
  ...unknown[]
]
  ? First
  : never;

const upperCase: <S extends string>(s: S) => Uppercase<S> = (x) =>
  x.toUpperCase() as Uppercase<typeof x>;
const lowerCase: <S extends string>(s: S) => Lowercase<S> = (x) =>
  x.toLowerCase() as Lowercase<typeof x>;
const firstChar = <S extends string>(x: S): FirstChar<S> =>
  x[0] as FirstChar<S>;
const firstItem = <T extends readonly unknown[]>(x: T): FirstItem<T> =>
  x[0] as FirstItem<T>;
const makeTuple = <T extends string>(x: T): [T] => [x] as [T];
const makeBox = <T>(value: T): { value: T } => ({ value });

// const tuple = makeTuple("hello!" as const); // Type: readonly ["hello!"]
// const item = firstItem(tuple); // Should resolve to type "hello!"
// const box = makeBox(item); // Should be { value: "hello!" }

// // Check intermediate inferred types explicitly:
// type T1_Step1 = ReturnType<typeof makeTuple>; // Expect readonly ["hello!"]
// type T1_Step2 = ReturnType<typeof firstItem>; // Expect "hello!"
// type T1_Step3 = ReturnType<typeof makeBox>;

import type { Equal, Expect } from "npm:type-testing";

const t0 = compose(upperCase, makeTuple, makeBox)("hello!").value[0];
//    ^?
type t0_actual = typeof t0; // =>
type t0_expected = "HELLO!"; // =>
type t0_test = Expect<Equal<t0_actual, t0_expected>>;

const t1 = compose(makeTuple, firstItem, makeBox)("hello!" as const).value;
type t1_actual = typeof t1; // =>
type t1_expected = "hello!"; // =>
type t1_test = Expect<Equal<t1_actual, t1_expected>>;

const t2 = compose(upperCase, firstChar, lowerCase)("hello!");
type t2_actual = typeof t2; // =>
type t2_expected = "h"; // =>
type t2_test = Expect<Equal<t2_actual, t2_expected>>;
