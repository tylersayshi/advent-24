const createStreetLight = <
  T extends string,
  _ extends never = never,
  D extends T = T
>(
  colors: T[],
  defaultColor: D
) => {
  console.log(colors);
  return defaultColor as T;
};
