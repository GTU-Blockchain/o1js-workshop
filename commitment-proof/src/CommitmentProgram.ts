import { ZkProgram, Field, Poseidon, Struct } from 'o1js';

export class PublicInputs extends Struct({
  commitment: Field,
}) {}

export class PublicOutputs extends Struct({
  commitment: Field,
}) {}

export class PrivateInputs extends Struct({
  secret: Field,
  salt: Field,
}) {}

export const CommitmentProgram = ZkProgram({
  name: 'CommitmentProof',
  publicInput: PublicInputs,
  publicOutput: PublicOutputs,
  methods: {
    prove: {
      privateInputs: [PrivateInputs],
      async method(publicInput: PublicInputs, privateInput: PrivateInputs) {
        const computedCommitment = Poseidon.hash([
          privateInput.secret,
          privateInput.salt,
        ]);

        publicInput.commitment.assertEquals(computedCommitment);

        return {
          publicOutput: {
            commitment: computedCommitment,
          },
        };
      },
    },
  },
});

export class CommitmentProgramProof extends ZkProgram.Proof(
  CommitmentProgram
) {}
