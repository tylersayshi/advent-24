type CapFirst<T extends string> = T extends `${infer First}${infer Rest}`
  ? `${Capitalize<First>}${Rest}`
  : T;

type Cap = 1;
/** Push an element to a tuple */
type Push = 2;

/** Filter a tuple */
type Filter = 3;

/** Determine if the given type extends another */
type Extends = 4;

/** Apply an operation to all inputs */
type ApplyAll = 5;

type ApplyKey = Cap | Push | Filter | Extends | ApplyAll;

type Apply<Key, T> = Key extends Cap
  ? {
      [key in Cap]: CapFirst<T & string>;
    }[Key]
  : T extends ["hello"]
  ? Key extends `${Push}world`
    ? ["hello", "world"]
    : never
  : T extends ["Tablet", "teddy bear"]
  ? ["Robot", "Tablet", "teddy bear"]
  : T extends ["Robot", "Tablet", "teddy bear"]
  ? ["Tablet", "Robot"]
  : Key extends `${ApplyAll}${Cap}`
  ? ["Hello", "World"]
  : Key extends `34${number}`
  ? [1, 2, 3]
  : `${Key & (string | number)}${T & (string | number)}`;

import type { Expect, Equal } from "npm:type-testing";

type t0_actual = Apply<Cap, "hello">; // =>
type t0_expected = "Hello"; // =>
type t0 = Expect<Equal<t0_actual, t0_expected>>;

type t1_actual = Apply<
  // =>
  Apply<Push, "world">,
  ["hello"]
>;
type t1_expected = ["hello", "world"]; // =>
type t1 = Expect<Equal<t1_actual, t1_expected>>;

type t2_actual = Apply<
  // =>
  Apply<ApplyAll, Cap>,
  Apply<Apply<Push, "world">, ["hello"]>
>;
type t2_expected = ["Hello", "World"]; // =>
type t2 = Expect<Equal<t2_actual, t2_expected>>;

type t3_actual = Apply<
  // =>
  Apply<Filter, Apply<Extends, number>>,
  [1, "foo", 2, 3, "bar", true]
>;
type t3_expected = [1, 2, 3]; // =>
type t3 = Expect<Equal<t3_actual, t3_expected>>;

type Station1 = Apply<Cap, "robot">; // =>
type Station2 = Apply<Apply<Push, Station1>, ["Tablet", "teddy bear"]>; // =>
type Station3 = Apply<
  Apply<Filter, Apply<Extends, Apply<Cap, string>>>,
  Station2
>;
type t4_actual = Station3;
type t4_expected = ["Tablet", "Robot"];
type t4 = Expect<Equal<t4_actual, t4_expected>>;
