export type Category = string | CategoryList | { [key in string]: Category };
export type CategoryList = Array<string | { [key in string]: Category }>;
// export type CategoryList =
const c: CategoryList = [
  "a",
  "b",
  {
    c: "c",
    d: ["d"],
    e: {
      f: "1",
      g: [
        "2",
        {
          h: "3",
        },
      ],
      i: {
        j: "4",
      },
    },
  },
];
