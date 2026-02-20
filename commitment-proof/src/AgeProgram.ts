import { ZkProgram, Field, Struct } from 'o1js';

export class PublicInputs extends Struct({
    minimumAge: Field
}) {}

export class PrivateInputs extends Struct({
    age: Field
}) {}

export class PublicOutputs extends Struct({
    isValid : Field
}) {}

export const AgeProgram = ZkProgram({
  name: 'AgeProof',
  publicInput: PublicInputs,
  publicOutput: PublicOutputs,
  methods: {
    prove: {
      privateInputs: [PrivateInputs],
      async method(publicInput: PublicInputs, privateInput: PrivateInputs) {
        privateInput.age.assertGreaterThanOrEqual(publicInput.minimumAge);
        
        return {
          publicOutput: {
            isValid: Field(1),
          },
        };
      },
    },
  },
  
});


