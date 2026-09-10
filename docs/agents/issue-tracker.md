# Issue tracker: GitHub

Issues and PRDs for this repo live as GitHub Issues. Use the `gh` CLI for all operations.

## Repository

Infer the repository from the current clone (`gh repo view --json nameWithOwner` or `git remote get-url origin`).
Do not hardcode a repository name unless `gh` cannot infer one from the working directory.

## Conventions

- **Create an issue**: `gh issue create --title "..." --body "..."`.
- **Read an issue**: `gh issue view <number> --comments`, including labels.
- **List issues**: `gh issue list --state open` with appropriate label filters.
- **Comment on an issue**: `gh issue comment <number> --body "..."`.
- **Apply or remove labels**: `gh issue edit <number> --add-label "..."` or `--remove-label "..."`.
- **Close**: `gh issue close <number> --comment "..."`.
