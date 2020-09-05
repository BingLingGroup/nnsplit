const csv = require("csv-parser");
const fs = require("fs");
const fetch = require("node-fetch");
const results = [];

const output_dir = "./static/";
fs.mkdirSync(output_dir, { recursive: true });
fs.createReadStream("../../../benchmarks/sample.json").pipe(
  fs.createWriteStream(`${output_dir}sample.json`)
);

fs.createReadStream("../../../nnsplit/models.csv")
  .pipe(
    csv({
      headers: false,
    })
  )
  .on("data", (data) => results.push(data))
  .on("end", () => {
    results.forEach((data) => {
      const name = data["0"];
      const url = data["1"];

      const root = `${output_dir}${name}/`;

      fs.mkdirSync(root, { recursive: true });
      ["model.onnx"].forEach((filename) => {
        const file_stream = fs.createWriteStream(`${root}${filename}`);

        fetch(`${url}${filename}`).then((response) => {
          response.body.pipe(file_stream);
        });
      });
    });
  });
