const fs = require('fs');
const ethers = require('ethers');

//换成你的lava RPC链接
const polygonRpcUrl = 'https://eth1.lava.build/lava-referer-811fdaa8-4181-4ffd-9f2d-7f8a076ee7d2/';
const provider = new ethers.providers.JsonRpcProvider(polygonRpcUrl);

const csvFilePath = './wallet.csv';
fs.readFile(csvFilePath, 'utf8', async (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    const lines = data.split('\n');
    let newCsvContent = lines[0].includes('balance') ? lines[0] : lines[0] + ',balance';

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (line) {
            const columns = line.split(',');
            const address = columns[0].trim();
            try {
                const balance = await provider.getBalance(address);
                const balanceEther = ethers.utils.formatEther(balance);
                console.log(`Address: ${address} - Balance: ${balanceEther} ETH`);
                newCsvContent += `\n${line}${columns.length > 1 ? '' : ','}${balanceEther}`;
            } catch (error) {
                console.error(`Error fetching balance for address ${address}: ${error}`);
                newCsvContent += `\n${line}`;
            }
        }
    }
});