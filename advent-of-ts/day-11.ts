type Excuse<T extends Record<string, string>> = {
  new (foo: Record<string, string[] | string>): keyof T extends string
    ? `${keyof T}: ${T[keyof T]}`
    : never;
};
