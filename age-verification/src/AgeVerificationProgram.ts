import { Field, ZkProgram, Struct, Bool, assert } from 'o1js';

export class PublicInputs extends Struct({
  minimumAge: Field,
  currentYear: Field,
}) {}

export class PublicOutputs extends Struct({
  isEligible: Bool,
}) {}

export class PrivateInputs extends Struct({
  yearOfBirth: Field,
}) {}

export const AgeVerificationProgram = ZkProgram({
  name: 'age-verification',
  publicInput: PublicInputs,
  publicOutput: PublicOutputs,
  methods: {
    proveAge: {
      privateInputs: [PrivateInputs],
      async method(publicInput: PublicInputs, privateInput: PrivateInputs) {
        const age = Field(publicInput.currentYear).sub(privateInput.yearOfBirth);
        const isEligible = age.greaterThanOrEqual(publicInput.minimumAge);
        
        // OPTION 1: No constraint enforcement - proof always succeeds
        // The isEligible output tells you if they meet the requirement
        // This allows you to generate proofs for any age and check the result
        
        // OPTION 2: Enforce constraint (uncomment below)
        assert(isEligible, 'You are not eligible for this program');
        // If uncommented, proof generation will FAIL for age < minimum
        
        return {
          publicOutput: new PublicOutputs({
            isEligible
          }),
        }
      },
    },
  },
});

export class AgeVerificationProof extends ZkProgram.Proof(AgeVerificationProgram) {}

