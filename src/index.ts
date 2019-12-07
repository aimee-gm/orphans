import glob from "glob";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { config } from "./imports/config";

const globPromise = promisify(glob);
const basePath = process.cwd();

function getRelativePath(file: string) {
  return path.relative(basePath, file);
}

function getFullPath(file: string) {
  return path.resolve(basePath, file);
}

async function getFromGlob({
  pattern,
  ignore
}: {
  pattern: string;
  ignore: RegExp[];
}) {
  const files = await globPromise(getFullPath(pattern));

  return files.filter(file => !ignore.some(regex => regex.exec(file)));
}

async function orphans() {
  const parents = await getFromGlob(config.parents);

  const children = new Set(await getFromGlob(config.children));

  parents.forEach(file => {
    console.log(`- Checking imports in ${getRelativePath(file)}`);
    const contents = fs.readFileSync(file, "utf8");
    const folder = path.dirname(file);

    const imports = contents.match(/from ("|')(\.[^"'\n]*)("|');/g);

    if (imports && imports.length) {
      imports.forEach(imp => {
        const matches = /from ("|')(\.[^"'\n]*)("|');/.exec(imp);

        if (!matches) {
          return;
        }

        const [, , relPath] = matches;

        const candidates = [
          path.resolve(folder, relPath),
          ...config.exts.map(ext => path.resolve(folder, `${relPath}.${ext}`))
        ];

        candidates.forEach(resolved => {
          if (children.has(resolved)) {
            console.log(`✔ Found import for ${getRelativePath(resolved)}`);
            children.delete(resolved);
          }
        });
      });
    }
  });

  for (const file of children) {
    console.log(`⚠ Cannot find import for ${getRelativePath(file)}`);
  }
}

orphans();
