import { describe, it } from 'node:test';
import assert from 'node:assert';
import { AgeCheck } from './AgeCheck.js';
import { Field, Mina, PrivateKey, AccountUpdate } from 'o1js';

describe('AgeCheck Tests', async () => {

    const Local = await Mina.LocalBlockchain({ proofsEnabled: false });
    Mina.setActiveInstance(Local);
    const deployer = Local.testAccounts[0];
    const zkAppKey = PrivateKey.random();
    const zkApp = new AgeCheck(zkAppKey.toPublicKey());

    await AgeCheck.compile();
    const tx = await Mina.transaction(deployer, async () => {
        AccountUpdate.fundNewAccount(deployer, 1);
        await zkApp.deploy();
    });
    await tx.sign([deployer.key, zkAppKey]).send();

    it(async () => {
        await Mina.transaction(deployer, async () => {
            await zkApp.verify_age(Field(20));
        })
            .prove()
            .sign([deployer.key])
            .send();
    });

    it(async () => {
        try {
            await Mina.transaction(deployer, async () => {
                await zkApp.verify_age(Field(15));
            })
                .prove()
                .sign([deployer.key])
                .send();
            assert.fail("error");
        } catch (e) {
            console.log("test failed");
        }
    });

});