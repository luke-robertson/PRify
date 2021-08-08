import { SimpleGit, SimpleGitOptions } from 'simple-git';
import fs from 'fs';
import readline from 'readline';

export const getOptions: (folderName: string) => Partial<SimpleGitOptions> = (folderName) => ({
  baseDir: folderName,
  binary: 'git',
  maxConcurrentProcesses: 6,
});

const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (questionText: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, (input) => resolve(input));
  });
};

export const setup = async (): Promise<string> => {
  const pulledGreen: string = await ask('Have you pulled green on your branch? Y/N - ');
  if (pulledGreen.toUpperCase() === 'N') {
    return process.exit();
  }
  try {
    // @ts-ignore
    const { path } = await import('./options');
    if (!path) {
      throw Error();
    }
    console.log('Canva Path:', path);
    return path;
  } catch {
    const newPath: string = await ask(
      'Please enter your canva repo path - format should be something like /Users/luke.r/Documents/dev/canva/:\n'
    );
    const pathWithSlash = newPath[newPath.length + 1] === '/' ? newPath : newPath + '/';
    fs.writeFileSync('./src/options.ts', `export const path = '${pathWithSlash}';`);
    return pathWithSlash;
  }
};

export const stripEndOfPath = (dir: string) => dir.substring(0, dir.lastIndexOf('/'));

export const parseTextToArray = (text: string) => text.split('\n').filter((row) => row);

export const moonWalk = (dir: string): string => {
  const files: string[] = fs.readdirSync(dir);
  const containsOwner = files.includes('OWNERS');
  if (containsOwner) {
    return dir;
  } else {
    return moonWalk(stripEndOfPath(dir));
  }
};

export const getFiles = (git: SimpleGit): Promise<string> =>
  new Promise((resolve) => {
    // @ts-ignore
    git.diff(['--name-only', 'origin/green...'], (_, data) => resolve(data));
  });

export const getBranch = (git: SimpleGit): Promise<string> =>
  new Promise((resolve) => {
    // @ts-ignore
    git.branch('--show-current', (_, data) => resolve(data.current));
  });

export const checkClean = (git: SimpleGit): Promise<string> =>
  new Promise((resolve) => {
    // @ts-ignore
    git.diff('--name-only', (_, data) => resolve(data.trim().length === 0));
  });
