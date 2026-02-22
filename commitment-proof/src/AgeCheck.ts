import { Field, SmartContract, method } from "o1js";

export class AgeCheck extends SmartContract {
    @method async verify_age(age: Field) {
        age.assertGreaterThanOrEqual(Field(18));
    }
}
