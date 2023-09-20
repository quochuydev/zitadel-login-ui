How to pull proto interfaces

1. Clone repo: https://github.com/zitadel/zitadel

2. Create `buf.gen.yaml`

```
version: v1
managed:
  enabled: true
plugins:
  - name: ts
    strategy: all
    path: ./node_modules/ts-proto/protoc-gen-ts_proto
    out: zitadel-server/proto
    opt:
      - esModuleInterop=true
      - env=node
      - outputServices=nice-grpc
      - outputServices=generic-definitions
      - useExactTypes=false
```

3. Create `buf.work.yaml`

```
version: v1
directories:
  - proto
```

4. Install packages

```
"@bufbuild/buf": "^1.26.1",
"ts-proto": "^1.156.7"
```

5. Update `packages.json`

```
"scripts": {
    "generate": "./node_modules/.bin/buf generate --path ./proto/zitadel"
}
```
