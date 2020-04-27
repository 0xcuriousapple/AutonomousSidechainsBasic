const fs = require("fs");
results = {};
fs.writeFile(
    "./testing/machine-learning/data/test.json",
    JSON.stringify(results),
    (err) => {
        if (err) {
            console.log("Error writing file", err);
        } else {
            console.log("Successfully wrote file");
        }
    }
);