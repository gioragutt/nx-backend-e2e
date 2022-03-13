# soluto-e2e

This library was generated with [Nx](https://nx.dev).

## Building

Run `nx build soluto-e2e` to build the library.

# Manual Usage

First, build the library as described above.
The generated project is an altered `@nrwl/node:application` that is stripped of the `build` & `serve` targets,
But added the following targets:
* `up` - runs a command to set-up dependencies, currently it's using `docker-compose` but we can update it to use tilt or whatever command we want.
* `down` - runs a command to tear-down dependencies.
* `e2e` - runs `nx up <project>`, `nx test <project>` and `nx down <project>` sequentially.

## Creating an E2E Project

```bash
yarn nx generate ./dist/libs/soluto-e2e:e2e-project
```

Will generate an e2e project for the default project of the workspace

```bash
yarn nx generate ./dist/libs/soluto-e2e:e2e-project --project=tags-api
```

Will generate an e2e project for the specified project

```bash
yarn nx generate ./dist/libs/soluto-e2e:e2e-project --wiremock
```

Will generate an e2e project with `wiremock` boilerplate set up

```bash
yarn nx generate ./dist/libs/soluto-e2e:e2e-project --oidc-server-mock
```

Will generate an e2e project with `oidc-server-mock` boilerplate set up

```bash
yarn nx generate ./dist/libs/soluto-e2e:e2e-project --name=my-e2e-project
```

Will generate an e2e project named `"my-e2e-project"`

```bash
yarn nx generate ./dist/libs/soluto-e2e:e2e-project \
  --name=test-e2e-app \
  --project=tags-api \
  --oidc-server-mock \
  --wiremock
```

Will do all over the above

## Adding `wiremock` support to existing e2e projects

```bash
yarn nx generate ./dist/libs/soluto-e2e:wiremock --project=test-e2e-app
```

## Adding `oidc-server-mock` support to existing e2e projects

yarn nx generate ./dist/libs/soluto-e2e:oidc-server-mock --project=test-e2e-app

## Running unit tests

Run `nx test soluto-e2e` to execute the unit tests via [Jest](https://jestjs.io).
