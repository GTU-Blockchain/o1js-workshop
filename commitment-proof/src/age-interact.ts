import { Field } from 'o1js';
import { AgeProgram, PublicInputs, PrivateInputs } from './AgeProgram.js';

console.log('Compiling AgeProgram');
const { verificationKey } = await AgeProgram.compile();
console.log('Compilation complete\n');

// Test 1:

const minimumAge = Field(18);
const validAge = Field(25);

console.log('Your Age (Private):', validAge.toString());
console.log('Minimum Age Required:', minimumAge.toString());
console.log('Generating proof');

const publicInput1 = new PublicInputs({ minimumAge });
const privateInput1 = new PrivateInputs({ age: validAge });

const { proof: validProof } = await AgeProgram.prove(publicInput1, privateInput1);

console.log('Proof generated!');
console.log('Verifying proof...');

await validProof.verify();
console.log('Proof is valid!\n');

// Test 2: Invalid

const invalidAge = Field(17);

console.log('Your Age (Private):', invalidAge.toString());
console.log('Minimum Age Required:', minimumAge.toString());
console.log('Attempting to generate proof');

try {
  const publicInput2 = new PublicInputs({ minimumAge });
  const privateInput2 = new PrivateInputs({ age: invalidAge });
  
  await AgeProgram.prove(publicInput2, privateInput2);
  console.log('Invalid');
} catch (error) {
  console.log('Cannot prove age < 18');
  console.log('Error:', error instanceof Error ? error.message.split('\n')[0] : error);
}