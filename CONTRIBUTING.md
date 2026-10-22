# Contributing

Contributions are welcome through pull requests. Work on a feature branch in your fork rather than committing directly to `main`.

## Fork and clone

1. Fork this repository on GitHub.
2. Clone your fork and enter the project directory:

   ```bash
   git clone https://github.com/YOUR_GITHUB_USERNAME/Multi-Agent-Reseach-and-Report-Factory.git
   cd Multi-Agent-Reseach-and-Report-Factory
   ```

3. Add the original repository as `upstream` if it is not already configured:

   ```bash
   git remote add upstream https://github.com/AnushkaTandon26/Multi-Agent-Reseach-and-Report-Factory.git
   ```

## Create a branch and make changes

Start from the latest `main` branch and create a descriptive branch for your change:

```bash
git fetch upstream
git switch -c docs/describe-your-change upstream/main
```

Replace `docs/describe-your-change` with a unique branch name that matches your work. Make focused changes, then check what will be committed:

```bash
git status
git diff --check
```

Stage only the files related to your change, commit, and push the branch to your fork:

```bash
git add path/to/changed-file
git commit -m "docs: describe your change"
git push -u origin docs/describe-your-change
```

## Check your changes

For code changes, install dependencies with `npm install`, then run the automated tests and linter:

```bash
npm test
npm run lint
```

For documentation-only changes, check the diff for whitespace errors:

```bash
git diff --check
```

## Open a pull request

On GitHub, open a pull request from your fork branch to this repository's `main` branch. Review the base repository and branch before submitting. Keep each pull request focused on one change, and never include API keys or other secrets in commits.
