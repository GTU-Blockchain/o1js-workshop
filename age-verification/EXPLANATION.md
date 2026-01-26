# Understanding Public Inputs, Private Inputs, and Public Outputs

## Overview

When building ZK programs, you have three types of data:

```
┌─────────────────┐
│ Public Inputs   │ → What the verifier specifies
└─────────────────┘
         ↓
┌─────────────────┐
│ Private Inputs  │ → What the prover keeps secret
└─────────────────┘
         ↓
    [ZK Proof]
         ↓
┌─────────────────┐
│ Public Outputs  │ → What the proof reveals
└─────────────────┘
```

## 1. **Public Inputs** - The Challenge

Public inputs are parameters that **both the prover and verifier agree on** before creating the proof.

### Age Verification Examples:
- **Minimum age requirement** (18 for voting, 21 for drinking)
- **Current date/year** (to calculate age from birth year)
- **Verification context ID** (links the proof to a specific request)
- **Location/jurisdiction** (different places have different age requirements)

```typescript
export class PublicInputs extends Struct({
  minimumAge: Field,      // Verifier says: "prove you're at least 18"
  currentYear: Field,     // Verifier says: "using 2026 as current year"
  verificationId: Field,  // Verifier says: "this is for request #12345"
}) {}
```

**Why use public inputs?**
- Makes the proof flexible (same program, different parameters)
- Prevents replay attacks (proof is tied to specific context)
- Allows verifier to specify requirements

## 2. **Private Inputs** - The Secret

Private inputs are values **only the prover knows**. They are **never revealed** to the verifier.

### Age Verification Examples:
- **Year of birth** (actual date)
- **ID number** (government ID)
- **Biometric data** (fingerprint hash)
- **Secret salt** (randomness for privacy)

```typescript
export class PrivateInputs extends Struct({
  yearOfBirth: Field,  // Your secret: born in 1998
}) {}
```

**Why use private inputs?**
- This is the core of ZK: proving you know something without revealing it
- Protects privacy while enabling verification
- The verifier never sees this data

## 3. **Public Outputs** - The Result

Public outputs are values **the proof reveals** after successful generation.

### Age Verification Examples:
- **Boolean eligibility** (yes/no: are they old enough?)
- **Age bracket** (18-25, 26-35, etc. - reveals range, not exact age)
- **Timestamp** (when the proof was created)
- **Hash of credentials** (fingerprint of verification data)

```typescript
export class PublicOutputs extends Struct({
  isEligible: Bool,      // Result: yes, they're old enough
  ageBracket: Field,     // Additional info: they're 18-25
  verificationId: Field, // Echo back the request ID
}) {}
```

**Why use public outputs?**
- Provides useful information without revealing secrets
- Allows fine-grained disclosure (age bracket vs exact age)
- Links proof back to original request

---

## Comparison: Simple vs Enhanced

### **Simple Version** (your original)
```typescript
ZkProgram({
  methods: {
    proveAge: {
      privateInputs: [Field], // Just the age
      async method(age: Field) {
        age.assertGreaterThanOrEqual(Field(18)); // Hardcoded 18
      }
    }
  }
});
```

**Limitations:**
- ❌ Minimum age is hardcoded (always 18)
- ❌ No outputs (binary: proof works or doesn't)
- ❌ Can't distinguish different verification contexts

### **Enhanced Version** (with all three)
```typescript
ZkProgram({
  publicInput: PublicInputs,   // Verifier specifies requirements
  publicOutput: PublicOutputs, // Proof reveals results
  methods: {
    proveAge: {
      privateInputs: [PrivateInputs], // Prover's secrets
      async method(publicIn, privateIn) {
        // Calculate age from secret birth year
        const age = publicIn.currentYear.sub(privateIn.yearOfBirth);
        
        // Check against public minimum requirement
        const isEligible = age.greaterThanOrEqual(publicIn.minimumAge);
        isEligible.assertTrue();
        
        // Reveal age bracket (not exact age)
        const bracket = calculateAgeBracket(age);
        
        return {
          publicOutput: {
            isEligible,
            ageBracket: bracket,
            verificationId: publicIn.verificationId,
          }
        };
      }
    }
  }
});
```

**Benefits:**
- ✅ Flexible minimum age (different use cases)
- ✅ Outputs provide useful info (eligibility + age range)
- ✅ Context-aware (verification ID prevents replay)
- ✅ Privacy-preserving (exact age still hidden)

---

## Real-World Example

### Scenario: Online Casino Account Creation

**Verifier (Casino) provides:**
```typescript
PublicInputs {
  minimumAge: 21,           // Must be 21+ for gambling
  currentYear: 2026,        // Current year
  verificationId: 789012,   // Unique session ID
}
```

**Prover (User) has:**
```typescript
PrivateInputs {
  yearOfBirth: 1999,  // Secret: they were born in 1999
}
```

**Proof generates:**
```typescript
PublicOutputs {
  isEligible: true,         // Yes, they qualify
  ageBracket: 2,            // They're in the 26-35 range
  verificationId: 789012,   // Matches the request
}
```

**Result:**
- Casino knows: ✅ User is 21+, ✅ They're 26-35 years old
- Casino doesn't know: ❌ Exact birth date
- User's privacy: 🔒 Protected

---

## When to Use Each Pattern

### Use **Simple** (no public inputs/outputs) when:
- ✅ Requirement is always the same (always 18)
- ✅ Binary result is enough (yes/no)
- ✅ No context needed

### Use **Enhanced** (with public inputs/outputs) when:
- ✅ Requirements change (different age limits)
- ✅ Need partial disclosure (age bracket, not exact age)
- ✅ Need to link proofs to requests
- ✅ Want replay attack protection
- ✅ Building production systems

---

## Try It Yourself!

Run both versions:

**Simple:**
```bash
npm run interact
```

**Enhanced:**
```bash
npm run interact:enhanced
```

Compare the outputs and see the difference!
