const real = Deno.readTextFileSync("./input.txt").trim();

const example = "2333133121414131402";

// even indexes are sizes of fileblock
// odd indices don't count as ids and are instead markers of `...` between sizes

const getCheckSum = (input: string) => {
  const len = input.length / 2;

  let thing = "";
  let dotsAdded = 0;
  for (let i = 0; i < len; i++) {
    const [size, freeSpace] = input.slice(i * 2, i * 2 + 2);
    const sizeString = new Array(+size).fill(i).join("");

    thing += sizeString;
    if (freeSpace) {
      const freeString = new Array(+freeSpace).fill(".").join("");
      dotsAdded += +freeSpace;
      thing += freeString;
    }
  }

  const resultThing = thing.split("");

  let lookingFromEnd = 1;
  let lookingFromStart = 1;
  // now rebalance

  while (lookingFromEnd <= dotsAdded) {
    while (resultThing.at(-1 * lookingFromEnd) === ".") {
      lookingFromEnd++;
    }

    const item = resultThing.at(-lookingFromEnd)!;
    while (resultThing.at(lookingFromStart) !== ".") {
      lookingFromStart++;
    }

    resultThing[lookingFromStart] = item;
    resultThing[resultThing.length - lookingFromEnd] = ".";

    lookingFromEnd++;
    lookingFromStart++;
  }

  let i = 0;
  let result = 0;
  while (resultThing[i] !== ".") {
    result += i * +resultThing[i];
    i++;
  }

  while (i < resultThing.length) {
    if (resultThing[i] !== ".") {
      throw new Error(resultThing[i]);
    }
    i++;
  }
  console.log({
    dotsAdded,
    lookingFromEnd,
    lookingFromStart,
  });
  console.log(result);
};

getCheckSum(real);

// 90328963761

// my problem is for numbers bigger than 10 we need to still group them as a single id
