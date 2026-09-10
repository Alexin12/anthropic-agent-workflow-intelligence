# Git Workflow

- Start every new issue from the latest `master` branch by creating one short, simple, feature-specific branch, such as `add-git-workflow`.
- Keep one feature per branch and commit only to that feature branch.
- Agents must never merge into `master`; the only path into `master` is a pull request (`PR`).
- Notify the user immediately before every commit attempt and every PR creation attempt.
- Only a human may merge a PR into the local `master` branch and push `master` to the remote repository.
