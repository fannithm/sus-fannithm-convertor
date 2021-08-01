const fs = require("fs");
const convertor = require("./convertor");

const sus = fs.readFileSync('./135_master.sus', 'utf8');

const data = convertor(sus);

fs.writeFileSync("./map.json", JSON.stringify(data));
