import {
  CommitmentProgram,
  CommitmentProgramProof,
  PublicInputs,
  PrivateInputs,
} from './CommitmentProgram.js';
import { Field, Poseidon } from 'o1js';

/**
 * Commitment Proof - Interactive Demo
 *
 * This demonstrates the complete ZK workflow:
 * 1. Compile the program
 * 2. Create a commitment from secret + salt
 * 3. Generate a proof with private inputs (secret, salt)
 * 4. Verify the proof with public input (commitment)
 */

async function main() {
  console.log('🔨 Compiling CommitmentProgram...');
  const { verificationKey } = await CommitmentProgram.compile();
  console.log('✅ Compilation complete!\n');

  // Example 1: Valid commitment proof
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📝 Example 1: Valid Commitment Proof');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const secret = Field(42);
  const salt = Field(12345);
  const commitment = Poseidon.hash([secret, salt]);

  console.log('🔐 Secret:', secret.toString());
  console.log('🧂 Salt:', salt.toString());
  console.log(
    '📦 Commitment (hash):',
    '0x' + commitment.toBigInt().toString(16)
  );
  console.log('');

  const publicInput = new PublicInputs({
    commitment,
  });

  const privateInput = new PrivateInputs({
    secret,
    salt,
  });

  console.log('🔍 Generating proof...');
  const { proof } = await CommitmentProgram.prove(publicInput, privateInput);
  console.log('✅ Proof generated!\n');

  console.log('Proof:', proof);

  console.log('\n✔️  Verifying proof...');
  try {
    await proof.verify();
    console.log('✅ Proof is valid!');
    console.log('   We proved knowledge of the secret without revealing it.\n');
  } catch (error) {
    console.log('❌ Proof verification failed!');
    console.log('   Error:', (error as Error).message, '\n');
  }

  // Example 2: Try with different values
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📝 Example 2: Another Valid Proof');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const secret2 = Field(999);
  const salt2 = Field(888);
  const commitment2 = Poseidon.hash([secret2, salt2]);

  console.log('🔐 Secret:', secret2.toString());
  console.log('🧂 Salt:', salt2.toString());
  console.log(
    '📦 Commitment (hash):',
    '0x' + commitment2.toBigInt().toString(16)
  );
  console.log('');

  const publicInput2 = new PublicInputs({
    commitment: commitment2,
  });

  const privateInput2 = new PrivateInputs({
    secret: secret2,
    salt: salt2,
  });

  console.log('🔍 Generating proof...');
  const { proof: proof2 } = await CommitmentProgram.prove(
    publicInput2,
    privateInput2
  );
  console.log('✅ Proof generated!\n');

  console.log('✔️  Verifying proof...');
  try {
    await proof2.verify();
    console.log('✅ Proof is valid!\n');
  } catch (error) {
    console.log('❌ Proof verification failed!');
    console.log('   Error:', (error as Error).message, '\n');
  }

  // Example 3: Demonstrate that wrong secret fails
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📝 Example 3: Invalid Proof (Wrong Secret)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const wrongSecret = Field(9999); // Wrong secret!
  const publicInput3 = new PublicInputs({
    commitment: commitment2,
  });

  const privateInput3 = new PrivateInputs({
    secret: wrongSecret,
    salt: salt2,
  });

  console.log('🔐 Original Secret:', secret2.toString());
  console.log('🔐 Wrong Secret:', wrongSecret.toString());
  console.log('📦 Commitment:', '0x' + commitment2.toBigInt().toString(16));
  console.log('');

  console.log('🔍 Attempting to generate proof with wrong secret...');
  try {
    await CommitmentProgram.prove(publicInput3, privateInput3);
    console.log('❌ ERROR: Proof should have failed!\n');
  } catch (error) {
    console.log('✅ Correctly rejected proof with wrong secret');
    console.log('   Error:', (error as Error).message, '\n');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✨ Demo complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// Run the demo
main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
