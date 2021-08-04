# SUS to Fannithm Map Convertor

Conver .sus (Ched) format PJSK map to fannithm format.

View more at [Fannithm Map Format](https://www.notion.so/File-Format-525cf5eb690d49c2a88ebcb7bd3faf46).

## Installation

Add a `.yarnrc` (or `.npmrc`) file in your project root path.

```yml
# .yarnrc
"@fannithm:registry": "https://npm.pkg.github.com"
```

```properties
# .npmrc
@fannithm:registry=https://npm.pkg.github.com
```

Learn more on [GitHub Docs](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#installing-a-package).

Then run install command.

```bash
yarn add @fannithm/sus-fannithm-convertor
# or npm install @fannithm/sus-fannithm-convertor
```

## Usage

```js
const convertor = require("@fannithm/sus-fannithm-convertor");
const sus = fs.readFileSync('./135_master.sus', 'utf8');
const data = convertor(sus);
console.log(data);
```

## BUGS

1. BPM change will not be parsed correctly (Caused by sus-analyzer).
