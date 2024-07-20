# First stage: compile things.
FROM node:22-alpine AS build
WORKDIR /usr/src/app

# (Install OS dependencies; include -dev packages if needed.)
RUN corepack enable

# Install the Javascript dependencies, including all devDependencies.
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --immutable

# Copy the rest of the application in and build it.
COPY . .
# RUN yarn build
RUN yarn build

# Now /usr/src/app/dist has the built files.

# Second stage: run things.
FROM node:22-alpine
ENV NODE_ENV production
WORKDIR /usr/src/hls-restream

# (Install OS dependencies; just libraries.)
RUN corepack enable

# Install the Javascript dependencies, only runtime libraries.
COPY package.json yarn.lock .yarnrc.yml  ./
RUN yarn workspaces focus --production

# Copy the dist tree from the first stage.
WORKDIR /usr/src/hls-restream/app
COPY --from=build /usr/src/app/dist .

# Run the built application when the container starts.
RUN mkdir /usr/src/hls-restream/output
ENV OUTPUT_PATH "/usr/src/hls-restream/output/"

EXPOSE 5000
CMD node app.js
