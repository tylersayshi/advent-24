const createRoute = <Route extends number | `${number}`>(
  author: string,
  route: Route
) => {
  console.log(`[createRoute] route created by ${author} at ${Date.now()}`);
  return route;
};
