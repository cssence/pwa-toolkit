# The Original @cssence Toolbox

What started as a toolbox for html/css/js (focusing on CSS viewport units) is now my full-fledged progressive web app toolkit.

## Build

This is a zero-dependency project. It assumes you’ll be running on a *nix-like OS.
The `#!/bin/bash` build script makes use of the `sed` command, as looking at `./build.sh` will tell you.

All good? Then run the build:

```shell
npm run build
```

After the build, serve the `public` folder with an http-server of your choice, e.g.

```shell
npm install http-server
./node_modules/http-server/bin/http-server public/
```

## License

https://cssence.com/ - Some rights reserved - [CC BY 4.0](./LICENSE)
