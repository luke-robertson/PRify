import { SimpleGit, SimpleGitOptions } from 'simple-git';
import fs from 'fs';

export const getOptions: (folderName: string) => Partial<SimpleGitOptions> = (folderName) => ({
  baseDir: folderName,
  binary: 'git',
  maxConcurrentProcesses: 6,
});

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
