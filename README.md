# PRify  🚀  🧨  🙏

Sick of having BIG PR's? Well look no further, this tool will break up your PR by owners into separate branches.

## How to use 🦆

- Check out the branch on your local terminal, in canva/canva repo and pull green.
- Clone this repo somewhere
- Run `yarn install`
- Run `yarn start`
- - If first time, please enter a canva/canva path e.g `/Users/luke.r/Documents/dev/canva/`
- - It will be stored in `./src/options.ts`
- - Confirm if you want the branches pushed remote

## Results 👀

If you have a branch such as `feature/test-branch-123` and it touches 4 owners files. The results will be :

- feature/test-branch-123-1
- feature/test-branch-123-2
- feature/test-branch-123-3
- feature/test-branch-123-4


## Notes 📝

Please make sure you have pulled green and there are no uncommitted or staged files.
The new branches will be based on green, so can be PR independently, but will need to be merged after. The branches are either locally committed or pushed to git depending upon what option you selected.
