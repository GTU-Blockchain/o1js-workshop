import { AgeCheck } from './age.js';
import { Field } from 'o1js';

async function main() {
  console.log('Compiling program...');
  await AgeCheck.compile();

  const target = Field(18);

  console.log('Testing valid age: 25...');
  try {
    const proof = await AgeCheck.verifyAge(target, Field(25));
    console.log('✅ Proof generated successfully for age 25!');
  } catch (e) {
    console.log('❌ Failed to prove valid age.');
  }

  console.log('Testing invalid age: 16...');
  try {
    await AgeCheck.verifyAge(target, Field(16));
    console.log('❌ Error: Allowed a proof for age 16!');
  } catch (e) {
    console.log('✅ Success: Correctly blocked proof for age 16.');
  }
}

main();