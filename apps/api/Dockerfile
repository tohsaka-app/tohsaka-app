FROM node:18 as build

RUN apt install curl \
  && curl -sL https://unpkg.com/@pnpm/self-installer | node

WORKDIR /build/

# If this file changes, we need to rebuild the dependencies.
COPY package.json /build/

RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store\
  pnpm install --prefer-offline --unsafe-perm\
  | grep -v "cross-device link not permitted\|Falling back to copying packages from store"
# ^ pnpm tries to symlink files, but in docker it cannot, so we let it throw warnings.

COPY . /build/

RUN pnpm exec tsc

# ---
FROM node:18 as app

WORKDIR /app/

# Copy dependencies from previous stage.
COPY --from=build /build/node_modules/ /app/node_modules

# Copy the compiled files.
COPY --from=build /build/dist/ /app/dist/

CMD [ "node", "/app/dist/index.js" ]