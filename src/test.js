const fs = require("fs");
const convertor = require("./convertor");

const sus = fs.readFileSync('./1.sus', 'utf8');

const data = convertor(sus);

fs.writeFileSync("./map.json", JSON.stringify(data));
