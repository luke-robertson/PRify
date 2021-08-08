import simpleGit from 'simple-git';
import {
  getOptions,
  stripEndOfPath,
  moonWalk,
  getFiles,
  getBranch,
  parseTextToArray,
  setup,
} from './helpers';

const run = async () => {
  const path = await setup();
  const git = simpleGit(getOptions(path));
  console.log('This only works if your based on green and have latest green');
  const currentBranch = await getBranch(git);
  console.log('Current Branch', currentBranch);
  const rawFileNames = await getFiles(git);

  if (!rawFileNames) {
    return console.log('Cant find file changes');
  }

  const fileNames = rawFileNames ? parseTextToArray(rawFileNames) : [];

  const ownersMap = fileNames.reduce((acc, item) => {
    const owner = moonWalk(path + stripEndOfPath(item));
    if (!acc[owner]) {
      acc[owner] = [];
    }
    acc[owner].push(item);
    return acc;
  }, {} as { [key: string]: string[] });

  console.log('Found:', fileNames.length, 'files');
  console.log('Found:', Object.keys(ownersMap).length, 'OWNER files');

  await git.checkout('green');

  for (const [i, files] of Object.values(ownersMap).entries()) {
    const index = i + 1;
    const brachName = currentBranch + '-' + index;
    console.log('Making Branch:', brachName);
    try {
      await git.checkoutBranch(brachName, 'green');
    } catch (e) {
      console.log('Branch exists, checking it out');
      await git.checkout(brachName);
    }
    for (const file of files) {
      await git.checkout([currentBranch, file]);
    }

    await git.add('--all');
    await git.commit('.');
  }

  await git.checkout(currentBranch);
};

run();
