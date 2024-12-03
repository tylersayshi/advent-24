const input = Deno.readTextFileSync("./day-3.txt");

// tries
// 183380722
// 82733683
const getTwo = () => {
  const matcher = input.matchAll(/(mul\(\d{1,3},\d{1,3}\)|do\(\)|don\'t\(\))/g);

  let shouldDo = true;
  let sum = 0;
  for (const r of matcher) {
    const thing = r[0];
    if (thing.startsWith("don")) {
      console.log(JSON.stringify({ thing }));
    }
    if (thing === "do()") {
      shouldDo = true;
      continue;
    } else if (thing.startsWith("don")) {
      shouldDo = false;
      continue;
    } else if (!shouldDo) {
      continue;
    }

    const nums = thing.replace("mul(", "").replace(")", "");
    const [a, b] = nums.split(",").map(Number);
    sum += a * b;
  }
  return sum;
};

const getOne = () => {
  const res = input.matchAll(/(mul\(\d{1,3},\d{1,3}\)|do\(\)|dont\(\))/g);

  let sum = 0;
  for (const r of res) {
    const thing = r[0].replace("mul(", "").replace(")", "");
    const [a, b] = thing.split(",").map(Number);
    sum += a * b;
  }
  return sum;
};

console.log({
  stepOne: getOne(),
  stepTwo: getTwo(),
});
