import simpleGit from 'simple-git';
import {
  getOptions,
  stripEndOfPath,
  moonWalk,
  getFiles,
  getBranch,
  parseTextToArray,
  setup,
  checkClean,
  ask
} from './helpers';

const run = async () => {
  const path = await setup();
  const git = simpleGit(getOptions(path));

  const pushToGit: string = await ask(
    'Do you want to push the new branches remotely to git? Y/N'
  );

  const isClean = await checkClean(git);
  if (!isClean) {
    console.log('canva/canva is not clean, please remove files');
    return process.exit();
  }

  console.log('');
  console.log('This only works if your based on green and have latest green');
  console.log('');

  const currentBranch = await getBranch(git);
  console.log('Current Branch', currentBranch);
  console.log('');

  const rawFileNames = await getFiles(git);
  if (!rawFileNames) {
    console.log('Cant find file changes');
    return process.exit();
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
  console.log('');

  console.log('Checking out green as new branch base');
  await git.checkout('green');

  console.log('Pulling green');
  console.log('');
  await git.pull();

  try {
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
        // console.log(file)
        await git.checkout([currentBranch, file]);
      }

      await git.add('--all');
      await git.commit('.');
      if (pushToGit.toUpperCase() === 'Y') {
        await git.push(['--set-upstream','origin', brachName])
      }
    }
  } catch (e) {
    console.log(e);
  }

  console.log('');
  console.log('Results:');
  Object.values(ownersMap).map((_, i) => console.log(currentBranch + '-' + i));

  await git.checkout(currentBranch);

  return process.exit();
};

run();
