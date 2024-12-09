const real = Deno.readTextFileSync("./day-9.txt").trim();

const example = "2333133121414131402";
const example2 = "233313312141413140212"; // todo this is to test with 10 as id

// even indexes are sizes of fileblock
// odd indices don't count as ids and are instead markers of `...` between sizes

const partOne = (input: string) => {
  const len = input.length / 2;

  const thing: string[] = [];
  let dotsAdded = 0;
  for (let i = 0; i < len; i++) {
    const [size, freeSpace] = input.slice(i * 2, i * 2 + 2);

    thing.push(...new Array(+size).fill(i));
    if (freeSpace) {
      thing.push(...new Array(+freeSpace).fill("."));
      dotsAdded += +freeSpace;
    }
  }

  let lookingFromEnd = 1;
  let lookingFromStart = 1;
  // now rebalance

  while (lookingFromEnd <= dotsAdded) {
    while (thing.at(-1 * lookingFromEnd) === ".") {
      lookingFromEnd++;
    }

    const item = thing.at(-lookingFromEnd)!;
    while (thing.at(lookingFromStart) !== ".") {
      lookingFromStart++;
    }

    thing[lookingFromStart] = item;
    thing[thing.length - lookingFromEnd] = ".";

    lookingFromEnd++;
    lookingFromStart++;
  }

  let i = 0;
  let result = 0;
  while (thing[i] !== ".") {
    result += i * +thing[i];
    i++;
  }

  while (i < thing.length) {
    if (thing[i] !== ".") {
      throw new Error(thing[i]);
    }
    i++;
  }
  console.log(thing.slice(0, 20));
  console.log(result);
};

const partTwo = (input: string) => {
  // even indexes are sizes of fileblock
  // odd indices don't count as ids and are instead markers of `...` between sizes

  const len = input.length / 2;

  const thing: string[] = [];
  let dotsAdded = 0;
  for (let i = 0; i < len; i++) {
    const [size, freeSpace] = input.slice(i * 2, i * 2 + 2);

    thing.push(...new Array(+size).fill(i));
    if (freeSpace) {
      thing.push(...new Array(+freeSpace).fill("."));
      dotsAdded += +freeSpace;
    }
  }

  for (let i = thing.length - 1; i > 0; i--) {
    if (thing[i] === ".") {
      continue;
    }
    const isFirst = i === 0 || thing[i - 1] !== thing[i];

    if (isFirst) {
      let sliceSize = 1;
      while (thing[i + sliceSize] === thing[i]) sliceSize++;
      const insertIndex = thing
        .map((x) => (x === "." ? "." : "x"))
        .join("")
        .indexOf(".".repeat(sliceSize));
      if (insertIndex < i && insertIndex !== -1) {
        thing.splice(
          insertIndex,
          sliceSize,
          ...(new Array(sliceSize).fill(thing[i]) as string[])
        );
        thing.splice(
          i,
          sliceSize,
          ...(new Array(sliceSize).fill(".") as string[])
        );
      }
    }
  }

  console.log(
    thing.reduce((acc, item, ind) => {
      if (item === ".") return acc;

      return acc + Number(item) * ind;
    }, 0)
  );
};

partOne(real);
partTwo(real);

// 6378826667552

// my problem is for numbers bigger than 10 we need to still group them as a single id
