# sms (Static)

This folder contains a static school management dashboard built with HTML, CSS and vanilla JavaScript.

How to publish using GitHub Pages

1. Initialize a git repository (if not already):

```bash
git init
git add .
git commit -m "Initial commit: school-management-system"
```

2. Create a GitHub repository and push (replace `<your-repo>`):

Using GitHub CLI:
```bash
gh repo create <sms> --public --source=. --remote=origin --push
```

Or manually create the repo on github.com and then:
```bash
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

3. The included GitHub Actions workflow (`.github/workflows/pages.yml`) will automatically publish the repository to GitHub Pages after push. The site URL will be:

`https://<your-username>.github.io/<your-repo>/`

Notes
- If your default branch is `master`, push to `master` instead of `main`.
- The workflow deploys the repository root — if you prefer only the `school-management-system` subfolder, change the `path` in the workflow to `./school-management-system`.
