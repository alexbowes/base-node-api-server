You can debug with vcode using the following configuration:

```json

{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Mocha Integration Tests",
            "program": "${workspaceRoot}/node_modules/mocha/bin/_mocha",
            "args": [
                "-u",
                "tdd",
                "--timeout",
                "999999",
                "--colors",
                "${workspaceRoot}/integration-tests/**/*.spec.js"
            ],
            "internalConsoleOptions": "openOnSessionStart"
        },
        {
            "type": "node",
            "request": "launch",
            "name": "Mocha Unit Tests",
            "program": "${workspaceRoot}/node_modules/mocha/bin/_mocha",
            "args": [
                "-u",
                "tdd",
                "--timeout",
                "999999",
                "--colors",
                "${workspaceRoot}/src/**/*.spec.js"
            ],
            "internalConsoleOptions": "openOnSessionStart"
        },
        {
            "type": "node",
            "request": "launch",
            "name": "Launch Program",
            "program": "${workspaceRoot}/src/server.js"
        }
    ]
}

```

This presents three configurations:

- Manual testing via running server with nodemon
- Testing unit tests with mocha
- Testing integration (route) tests with mocha + supertest

