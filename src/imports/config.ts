export const config = {
  children: {
    pattern: "./src/**/*.{ts,tsx}",
    ignore: [/\.spec\.tsx?/, /src\/index\.ts/]
  },
  parents: {
    pattern: "./src/**/*.{ts,tsx}",
    ignore: [/\.spec\.tsx?/]
  },
  exts: ["ts", "tsx"]
};
