export const config = {
  children: {
    pattern: "./src/**/*.{ts,tsx}",
    ignore: [/\.(spec|test)\.tsx?/, /src\/index\.ts/]
  },
  parents: {
    pattern: "./src/**/*.{ts,tsx}",
    ignore: [/\.(spec|test)\.tsx?/]
  },
  exts: ["ts", "tsx"]
};
