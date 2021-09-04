const fs = require("fs");
const { convertor, getScore } = require("./convertor");

const sus = fs.readFileSync('./test.sus', 'utf8');

const score = getScore(sus);
const data = convertor(sus);

fs.writeFileSync("./map.json", JSON.stringify(data));
fs.writeFileSync("./sus.json", JSON.stringify(score));
