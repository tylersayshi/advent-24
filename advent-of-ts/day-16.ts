type Curried<P extends any[], R> = <T extends any[]>(
  ...args: T
) => T extends []
  ? Curried<P, R>
  : T["length"] extends 0
  ? Curried<P, R>
  : T extends PartialTuple<P>
  ? Drop<P, T["length"]> extends []
    ? R
    : Curried<Drop<P, T["length"]>, R>
  : never;

type PartialTuple<P extends any[]> = P extends [infer First, ...infer Rest]
  ? [] | [First] | [First, ...PartialTuple<Rest>]
  : [];

type Drop<
  T extends any[],
  N extends number,
  I extends any[] = []
> = I["length"] extends N
  ? T
  : T extends [any, ...infer Rest]
  ? Drop<Rest, N, [0, ...I]>
  : [];

type Curry<F extends (...args: any) => any> = F extends (
  ...args: infer P
) => infer R
  ? Curried<P, R>
  : never;

declare function DynamicParamsCurrying<F extends (...args: any) => any>(
  f: F
): Curry<F>;

const originalCurry = (
  ingredient1: number,
  ingredient2: string,
  ingredient3: boolean,
  ingredient4: Date
) => true;

const spikedCurry = DynamicParamsCurrying(originalCurry);

// Direct call
const t0 = spikedCurry(0, "Ziltoid", true, new Date());

// Partially applied
const t1 = spikedCurry(1)("The", false, new Date());

// Another partial
const t2 = spikedCurry(0, "Omniscient", true)(new Date());

// You can keep callin' until the cows come home: it'll wait for the last argument
const t3 = spikedCurry()()()()(0, "Captain", true)()()()(new Date());

// currying is ok
const t4 = spikedCurry("Spectacular", 0, true);

// @ts-expect-error arguments provided in the wrong order
const e0 = spikedCurry("Nebulo9", 0, true)(new Date());
