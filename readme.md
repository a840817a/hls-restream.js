# hls-restream.js

[![Build and Publish](https://github.com/a840817a/hls-restream.js/actions/workflows/build-and-publish.yml/badge.svg)](https://github.com/a840817a/hls-restream.js/actions/workflows/build-and-publish.yml)
[![CodeQL](https://github.com/a840817a/hls-restream.js/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/a840817a/hls-restream.js/actions/workflows/github-code-scanning/codeql)

`hls-restream.js` is a TypeScript-based application designed for HLS (HTTP Live Streaming) restreaming. It is containerized with Docker for easy deployment.

## Features

- Written in TypeScript
- Supports HLS restreaming
- Containerized using Docker

## Prerequisites

- Docker installed on your machine

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/a840817a/hls-restream.js.git
    cd hls-restream.js
    ```

2. Install dependencies:
    ```sh
    yarn install
    ```

3. Build the project:
    ```sh
    yarn build
    ```

## Running with Docker

To run the application using Docker, use the following command:
```sh
docker container run --name hls-restream -p 80:5000 -v output:/usr/src/hls-restream/output/ a840817a/hls-restream.js
```
his will start the application and map port 5000 inside the container to port 80 on your host machine. The output will be stored in the output directory.

## Scripts

- `build`: Compiles the TypeScript code using Gulp.
- `start`: Runs the compiled JavaScript code.
- `start:build`: Builds the project and then starts it.
- `dev`: Runs the project in development mode with Nodemon, watching for changes in TypeScript files.

## Project Structure

- `src/`: Source files for the application.
- `dist/`: Compiled JavaScript files.

## License

This project is licensed under the MIT License.

If you have any questions or need further assistance, feel free to reach out.
