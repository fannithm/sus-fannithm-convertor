# SUS to Fannithm Map Convertor

Conver .sus (Ched) format PJSK map to fannithm format.

View more at [Fannithm Map Format](https://www.notion.so/File-Format-525cf5eb690d49c2a88ebcb7bd3faf46).

## Usage
```js
const convertor = require("./convertor");
const sus = fs.readFileSync('./135_master.sus', 'utf8');
const data = convertor(sus);
console.log(data);
```

## BUGS

1. Flick in slide will be dropped directly.
2. BPM change will not be parsed correctly (Caused by sus-analyzer).
