import { Field } from 'o1js';
import { AgeVerificationProgram, PublicInputs, PrivateInputs } from './AgeVerificationProgram.js';

console.log('compiling...');
const { verificationKey } = await AgeVerificationProgram.compile();
console.log('compilation complete');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Age Verification Program');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const publicInput = new PublicInputs({
  minimumAge: Field(18),
  currentYear: Field(2026),
});

const privateInput1 = new PrivateInputs({
  yearOfBirth: Field(2001),
});

const privateInput2 = new PrivateInputs({
  yearOfBirth: Field(2010),
});

console.log('Generating proof for birth year 2001...');
const { proof } = await AgeVerificationProgram.proveAge(publicInput, privateInput1);
console.log('Proof generated successfully!');

console.log('Proof:', proof);

console.log('Verifying the proof...');

try {
  const isValid = await AgeVerificationProgram.verify(proof);
  console.log(`Proof is valid: ${isValid}`);
  console.log(`Is eligible (age >= 18): ${proof.publicOutput.isEligible}`);
} catch (error) {
  console.log('Unexpected error:', error);
}

console.log();

console.log('Generating proof for birth year 2010...');
try {
  const { proof: proof2 } = await AgeVerificationProgram.proveAge(publicInput, privateInput2);
  
  console.log('Proof generated successfully!'); // if the proof is to be generated for age < 18, assert should be removed.
  console.log('Proof:', proof2);
} catch (error) {
  console.log('Correctly rejected - cannot generate proof for age < 18');
  console.log('Error:', (error as Error).message);
}

