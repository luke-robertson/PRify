import { SimpleGit, SimpleGitOptions } from 'simple-git';
import fs from 'fs';
import readline from 'readline';
import simpleGit from 'simple-git';
import { path } from '../options';

export const getOptions: (folderName: string) => Partial<SimpleGitOptions> = (folderName) => ({
  baseDir: folderName,
  binary: 'git',
  maxConcurrentProcesses: 6,
});

const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (questionText: string) => {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, (input) => resolve(input));
  });
};

export const setup = async () => {
  if (!path) {
    const newPath = await ask('Please enter your canva repo path - format should be something like /Users/luke.r/Documents/dev/canva/:\n');
    fs.writeFileSync('./options.ts', `export const path = '${newPath}';`);
  }
}

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
