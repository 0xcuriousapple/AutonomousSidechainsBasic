//Add script 
//"api-test-side": "node ./base/api-test-mainchain.js",
//in package.json
//while running manually provide argument in command line
//Just run Test.bat from its local directory


const request = require("request");
const fs = require("fs");

const { OPCODE_MAP } = require("../base/interpreter");
const { STOP, ADD, PUSH, STORE, LOAD } = OPCODE_MAP;
let BASE_URL = "http://localhost:3000";
results = {};

const postTransact = ({ code, to, value, gasLimit }) => {
  return new Promise((resolve, reject) => {
    request(
      `${BASE_URL}/mainchain/transfer`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, to, value, gasLimit }),
      },
      (error, response, body) => {
        return resolve(JSON.parse(body));
      }
    );
  });
};

const postCreateAcc = ({ }) => {
  return new Promise((resolve, reject) => {
    request(
      `${BASE_URL}/mainchain/create`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      },
      (error, response, body) => {
        return resolve(JSON.parse(body));
      }
    );
  });
};

const getMine = (port) => {
  port ? BASE_URL = "http://localhost:".concat(port) : BASE_URL = "http://localhost:".concat('3000');
  return new Promise((resolve, reject) => {

    request(`${BASE_URL}/mainchain/mine_direct`, (error, response, body) => {
      return resolve(JSON.parse(body));
    });

  });
};

const waitfor_x_txs = (no) => {
  return new Promise((resolve, reject) => {
    let id = setInterval(() => {
      let obj;
      request(`${BASE_URL}/mainchain/txqueue`, (error, response, body) => {
        obj = JSON.parse(body);
        //console.log(Object.keys(obj.transactionMap).length);
        if (Object.keys(obj.transactionMap).length == no) {
          clearInterval(id);
          return resolve(JSON.parse(body));
        };
      });

    }, 2000);

  });
}

let toAccountData;
const multiplier = process.argv[2]

async function Transactf(toAccountData) {

  for (j = 1; j < 101; j++) {
    const post1 = await postTransact({ to: toAccountData.address, value: 1 });
    if (j % 10 == 0) {
      const txq = await waitfor_x_txs(10);
      const mine = await getMine();
    }
  }
  let end = (new Date()).getTime()
  return end;
}

async function Transact(toAccountData) {

  let start = (new Date()).getTime()
  for (let i = 0; i < multiplier; i++) {
    const end = await Transactf(toAccountData);
    console.log(`Time required to post,broadcast,receive and for mining in the block for ${(i + 1) * 100} txs is ${end - start} ms`)
    results[(i + 1) * 100] = end - start;
  }

};
postCreateAcc({}).then((postResponse) => {
  console.log("(Create Account Transaction)")
  toAccountData = postResponse.transaction.data.accountData;
  return waitfor_x_txs(2);
}).then(() => {
  return getMine();
}).then(() => {
  return Transact(toAccountData);
}).then(() => {
  fs.writeFile(
    "./testing/performance_analysis/data/test.json",
    JSON.stringify(results),
    (err) => {
      if (err) {
        console.log("Error writing file", err);
      } else {
        console.log("Successfully wrote file");
      }
    }
  );

})






