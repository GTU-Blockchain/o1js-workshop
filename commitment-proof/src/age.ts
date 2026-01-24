import { ZkProgram, Field } from 'o1js';

export const AgeCheck = ZkProgram({
  name: 'age-check',
  publicInput: Field, 

  methods: {
    verifyAge: {
      privateInputs: [Field], 

      async method(targetAge: Field, privateAge: Field) {
        privateAge.assertGreaterThanOrEqual(targetAge);
      },
    },
  },
});