const createRoute = <Route extends string[]>(
  author: string,
  route: [...Route]
) => ({
  author,
  route: route,
  createdAt: Date.now(),
});
