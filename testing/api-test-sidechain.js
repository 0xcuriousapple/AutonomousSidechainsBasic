//Add script 
//"api-test-side": "node ./base/api-test-mainchain.js",
//in package.json
//while running manually provide argument in command line
//Just run Test.bat from its local directory


const request = require("request");
const fs = require("fs");
let BASE_URL = "http://localhost:3000"; //Mainchain
results = {};
const no_of_sidechains = parseInt(process.argv[2]);
let starting_PORT = 3000;
let percentage_of_tx_to_be_performed_on_each_chain = 100 / (no_of_sidechains);
//conside for 3
credentials = {
    1: {
        pubkey: "pub-c-b4ef5ca9-5b50-44f5-a57e-0894ab85c8b1",
        subkey: "sub-c-1a6ad124-7d8f-11ea-8ca3-9e2d2a3ca26d",
        seckey: "sec-c-NzdhNDFlOTgtNmZlMy00YWJkLTk3YzUtMWM1ZTMzM2ZiYWY4",
    },
    2: {
        pubkey: "pub-c-c54f800f-305c-4073-add9-a170f69e9b0a",
        subkey: "sub-c-02ef9dcc-87b7-11ea-a961-f6bfeb2ef611",
        seckey: "sec-c-N2YxNTEwNDEtZWUxYS00OThhLTgzYjAtODc0MjA1ZGE5NTNh",
    },
    3: {
        pubkey: "pub-c-92679baf-e6f7-4368-871d-c36d594921c6",
        subkey: "sub-c-6f30efa6-88f0-11ea-9e86-0adc820ce981",
        seckey: "sec-c-YjhkMTBlNTEtMzc1NS00MGU4LWFiMmItNWQ4YTYwOGM2NzA4",
    },
    4: {
        pubkey: "pub-c-09f443a5-6f59-4bc8-a52d-4818a717a9aa",
        subkey: "sub-c-663005ac-88f2-11ea-885f-2621b2dc68c7",
        seckey: "sec-c-NThjMGY3ODUtNDNjMC00NDk2LTlkNzItMTU5OWYxMmUwYTNk",
    },
    5: {
        pubkey: "pub-c-a4ae350e-9519-4060-8522-89894d1728c6",
        subkey: "sub-c-7ad7ad98-88f2-11ea-a961-f6bfeb2ef611",
        seckey: "sec-c-OGU5NWI0YTQtNzI4My00NDBiLWI4ZjUtMjY5OWM3YzNiYzY0",
    }

}


//Mainchain Promises
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
                // console.log(Object.keys(obj.transactionMap).length);
                // console.log(no);
                if (Object.keys(obj.transactionMap).length == no) {
                    clearInterval(id);
                    return resolve(JSON.parse(body));
                };
            });

        }, 2000);

    });
}

//Sidechain Promises
global.status = 0;
const createSideChains = (total) => {
    return new Promise((resolve, reject) => {
        for (i = 1; i <= total; i++) {
            request(
                `http://localhost:${starting_PORT + i}/sidechain/new/success`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: `Sidechain-Testing-${i}`, pubkey: credentials[i].pubkey, subkey: credentials[i].subkey, seckey: credentials[i].seckey }),
                },
                (error, response, body) => {
                    // console.log(JSON.parse(body));
                    status++;
                    // return resolve();
                }
            );
        }
        waitforthisno(total).then(() => { return resolve(); });
    })
}
const waitforthisno = (no) => {
    return new Promise((resolve, reject) => {
        let id = setInterval(() => {
            if (status == no) {
                clearInterval(id);
                status = 0;
                return resolve();
            };
        }, 1000);

    });
}
const waitfor_x_txs_Sidechain = (port, no) => {
    return new Promise((resolve, reject) => {
        let id = setInterval(() => {
            let obj;
            request(`http://localhost:${port}/sidechain/active/txqueue?id=0`, (error, response, body) => {
                obj = JSON.parse(body);
                console.log(port, Object.keys(obj.transactionMap).length, no);
                //console.log(no);
                if (Object.keys(obj.transactionMap).length == no) {
                    clearInterval(id);
                    return resolve(JSON.parse(body));
                };
            });

        }, 2000);

    });
}

const getMineSidechain = (port, id) => {
    return new Promise((resolve, reject) => {
        request(`http://localhost:${port}/sidechain/active/mine_direct?id=${id}`, (error, response, body) => {
            //return resolve(JSON.parse(body));
            return resolve();
        });
    });
};

const postCreateAccSidechain = (port) => {
    return new Promise((resolve, reject) => {
        request(
            `http://localhost:${port}/sidechain/active/create?id=0`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
            },
            (error, response, body) => {
                body.no = port - starting_PORT;
                return resolve(JSON.parse(body));
            }
        );
    });
};
const postTransactSidechain = ({ code, to, value, gasLimit }, port) => {
    return new Promise((resolve, reject) => {
        request(
            `http://localhost:${port}/sidechain/active/transfer?id=0`,
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

//Functions
async function TransactMain(toAccountData, repeat_count) {
    for (j = 1; j < repeat_count + 1; j++) {
        const post1 = await postTransact({ to: toAccountData.address, value: 1 });
        if (j % 10 == 0) {
            const txq = await waitfor_x_txs(10);
            const mine = await getMine();
        }
    }
}
async function TransactSide(toAccountData, repeat_count, port) {
    for (j = 1; j < repeat_count + 1; j++) {
        const post1 = await postTransactSidechain({ to: toAccountData.address, value: 1 }, port);
        if (j % 10 == 0) {
            const txq = await waitfor_x_txs_Sidechain(port, 10);
            const mine = await getMineSidechain(port, 0);
        }
    }
}

async function TransactBatchOf100() {
    repeat_count = 100 / (no_of_sidechains + 1) + 1
    TransactMain(toAccountData, repeat_count);

    for (i = 1; i <= no_of_sidechains; i++) {
        TransactSide(toAccountDataSidechain[i], repeat_count, starting_PORT + i).then(() => {
            status++;
        })
    }
    return waitforthisno(no_of_sidechains);
}
async function Transact() {
    let start = (new Date()).getTime()
    for (let i = 0; i < 10; i++) {
        await TransactBatchOf100();
        let end = (new Date()).getTime();
        console.log(`Time required to post,broadcast,receive and for mining in the block for ${(i + 1) * 100} txs is ${end - start} ms`)
        results[(i + 1) * 100] = end - start;
    }

};

//Action
toAccountDataSidechain = {}
let toAccountData;
postCreateAcc({}).then((postResponse) => {

    toAccountData = postResponse.transaction.data.accountData;
    console.log(`Mainchain: Waiting for ${2 + no_of_sidechains} tx `)
    console.log('TX : 2 Create Acc on port:3000 and 1 Create Acc for each port')
    return waitfor_x_txs(2 + no_of_sidechains);
}).then(() => {
    console.log(`TX Arrived now Waiting for them to get mined on localhost:3000`);
    return getMine();
}).then(() => {
    console.log("TX accounts on mainchain of all ports has been created");
    console.log("Request for one sidechain per port from 3001")
    return createSideChains(no_of_sidechains)
}).then(() => {
    console.log('Sidechains has been created Sucessfully');
    console.log('Broadcast : Create toAccount in each sidechain')
    for (i = 1; i <= no_of_sidechains; i++) {
        postCreateAccSidechain(starting_PORT + i).then((response) => {
            toAccountDataSidechain[response.no] = response.transaction.data.accountData;
            status++;
        })
    }
    return waitforthisno(no_of_sidechains);
}
).then(() => {

    console.log('Waiting for tx of two create accounts to arrive on each sidechain')
    for (i = 1; i <= no_of_sidechains; i++) {
        waitfor_x_txs_Sidechain(starting_PORT + i, 2).then(() => {
            status++;
        })
    }
    return waitforthisno(no_of_sidechains);
}).then(() => {
    console.log('TXs of create accounts arrived on each sidechain successfully')
    console.log('Waiting for tx of create accounts to get mined on each sidechain')
    for (i = 1; i <= no_of_sidechains; i++) {
        getMineSidechain(starting_PORT + i, 0).then(() => {
            status++;
        })
    }
    return waitforthisno(no_of_sidechains);
}).then(() => {
    console.log('TX of create accounts mined on each sidechain successfully')
    console.log('Posting tx')
    return Transact();
}).then(() => {
    console.log('Done baby')
})



    //     return Transact(toAccountData);
    // }).then(() => {
    //     fs.writeFile(
    //         "./testing/performance_analysis/data/test.json",
    //         JSON.stringify(results),
    //         (err) => {
    //             if (err) {
    //                 console.log("Error writing file", err);
    //             } else {
    //                 console.log("Successfully wrote file");
    //             }
    //         }
    //     );

    // })






