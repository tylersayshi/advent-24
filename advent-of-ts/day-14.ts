type PerfReview<T> = T extends AsyncGenerator<infer Thing, any, any>
  ? Thing
  : never;
