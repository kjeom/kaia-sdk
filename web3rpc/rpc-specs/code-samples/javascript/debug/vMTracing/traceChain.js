const { JsonRpcProvider } = require("@kaiachain/ethers-ext");

(async () => {
    const provider = new JsonRpcProvider("https://public-en-kairos.node.kaia.io");

    const startBlock = "1000";
    const endBlock = "1001";
    const options = { tracer: "revertTracer" };
    // The full list of JSON-RPC is available at:
    // https://archive-docs.klaytn.foundation/content/dapp/json-rpc/api-references
    provider.debug.traceChain(
        startBlock,
        endBlock,
        options,
        null,
        (err, data, response) => {

            console.log("Trace chain", data);
        }
    );
})();
