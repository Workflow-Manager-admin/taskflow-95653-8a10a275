#!/bin/bash
cd /home/kavia/workspace/code-generation/taskflow-95653-8a10a275/task_management_backend
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

