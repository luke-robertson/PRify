# SUPER PR  🚀  🧨  🙏

Sick of having BIG PR's? Well look no further, this tool will break up your PR by owners into separate branches.

## How to use 🦆

- Check out the branch on your local terminal, in canva/canva repo and pull green.
- Clone this repo somewhere
- Run `yarn install`
- Run `yarn start`
- - If first time, please enter a canva/canva path e.g `/Users/luke.r/Documents/dev/canva/`
- - It will be stored in `./src/options.ts`

## Results 👀

If you have a branch such as `feature/test-branch-123` and it touches 4 owners files. The results will be :

- feature/test-branch-123-1
- feature/test-branch-123-2
- feature/test-branch-123-3
- feature/test-branch-123-4

These branches are locally committed with the correct files per OWNER file, you should push them remote.

## Notes 📝

Please make sure you have pulled green and there are no uncommitted or staged files.
The new branches will be based on green, so can be PR independently, but will need to be merged after

## todo 🍣

Push remote files automatically
