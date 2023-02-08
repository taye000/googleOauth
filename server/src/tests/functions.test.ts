import { functions } from "../functions";

//test("description", function)
test("Adds 2 + 2 to equal 4", () => {
  expect(functions.add(2, 2)).toBe(4);
});

test("the length of an input", ()=> {
  expect(functions.length("hello")).toHaveLength(5);
})