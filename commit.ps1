git fetch

git pull

node app.js

try {

    git pull

    # Stage all changes
    git add .

    # Commit changes with a message
    git commit -m "[Gowthamr Rasayanasala] Added new Files"

    # Push to the default branch (e.g., 'main' or 'master')
    git push origin main

    Write-Output "Changes committed and pushed successfully."
}
catch {
    Write-Error "Error: $_"
}