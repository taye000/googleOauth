// import { functions } from "../functions";

export const functions = {
  add: (a:number, b:number) => a + b
};

//test("description", function)
test("Adds 2 + 2 to equal 4", () => {
  expect(functions.add(2, 2)).toBe(4);
});
