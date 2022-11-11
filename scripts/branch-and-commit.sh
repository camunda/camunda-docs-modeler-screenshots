#!/bin/bash

set -eo pipefail
shopt -s inherit_errexit nullglob


PWD="$(pwd)"
WORKDIR="$(pwd)/tmp"
REPO_DIR="$WORKDIR/$REPO"

mkdir -p "$WORKDIR"

git clone --depth=1 "https://$BPMN_IO_TOKEN@github.com/$OWNER/$REPO.git" "$REPO_DIR"

cp -r "$PWD/$REPO" "$WORKDIR" 

cd "$REPO_DIR"

git config user.email "$BPMN_IO_EMAIL"
git config user.name "$BPMN_IO_USERNAME"
git config push.default simple

# add all resources
git branch $BRANCH
git checkout $BRANCH
git add -A
git commit -m "chore: update modeler screenshots"
git push -q --set-upstream origin $BRANCH &2>/dev/null

cd "$PWD"
