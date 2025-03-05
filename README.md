## Project Setup

The viewer on this project is set up by following the guides on **WebGI Documentation**.

### Installation & Setup

```sh
# Clone the repository
git clone https://github.com/frankerinage/three.git

# Navigate to the project directory
cd three

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Usage

Once the server is running, visit:

```
http://localhost:3030/webgi
```

For more details, refer to the [WebGI Documentation](https://webgi.xyz/docs).

### Known Issues & Troubleshooting

This project has several TypeScript errors in VS Code and throws the following runtime error while running the components:

```
ReferenceError: self is not defined
```

We tried following these WebGI documentation pages, but the errors persisted:

- [Viewer API](https://webgi.xyz/docs/manual/viewer-api)
- [Installation Guide](https://webgi.xyz/docs/installation)

#### Error Logs

For more details on errors, check the log file:

```
/logs/errors.log
```

Troubleshooting and finding a solution for the errors is required.
