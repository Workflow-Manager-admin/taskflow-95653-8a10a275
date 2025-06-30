To observe backend registration flow:

1. Start the backend in development mode to view logs (from the `task_management_backend` directory):
   npm run dev

2. Attempt registration from the frontend UI.

3. Observe logs in the backend terminal. You will see blocks starting with:
   --- Registration attempt ---

These logs will show:
- Request payload received by backend
- Validation checks/failures
- Duplicate user detection
- Success or error with details

Provide a copy of the logs after you attempt registration, especially if there is an error or the UI reports "registration failed". This will help confirm if the backend is hit and what occurs.
