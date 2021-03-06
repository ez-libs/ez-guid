export class Guid {
    /** Empty GUID string (hyphenated). */
    public static EMPTY: string = "00000000-0000-0000-0000-000000000000";
    private static validator: RegExp = new RegExp("^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$", "i");

    public static isValid(guid: string | Guid): boolean {
        if (typeof (guid) == "string") {
            try {
                let value: string = (guid.indexOf("-") < 0) ? (new Guid(guid)).toString() : guid; //if hyphenated, parse it first
                return this.validator.test(value)
            } catch { return false }
        } else return guid instanceof Guid
    }

    /** Static alias for `new Guid()`. Refer to the constructor for further information. */
    public static create(guid?: string): Guid {
        return new Guid(guid);
    }

    /** Generates an empty, hyphenated GUID object. */
    public static createEmpty(): Guid {
        return new Guid(this.EMPTY);
    }


    private static gen(count: number): string {
        let out: string = "";
        for (let i: number = 0; i < count; i++) {
            // tslint:disable-next-line:no-bitwise
            out += (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1).toLowerCase();
        }
        return out;
    }

    /** Generates a random, hyphenated GUID string. */
    public static random(): string {
        return [Guid.gen(2), Guid.gen(1), Guid.gen(1), Guid.gen(1), Guid.gen(3)].join("-");
    }

    /** Container for the GUID itself (in the hyphenated format). */
    private value: string = Guid.EMPTY;

    /** Creates a guid object from a given Guid or, (if no parameter is given) creates one. Supported formats are: hyphenated and non-hyphenated. */
    constructor(guid?: string) {
        if (guid && Guid.validator.test(guid)) { //hyphenated, no conversion necessary
            this.value = guid.toLowerCase();
        } else if (guid && !(guid.indexOf("-") >= 0) && guid.length == 32) { //non-hyphenated
            let tempGuid: string = "";
            let pos: number = 0;

            for (const i of [8, 4, 4, 4, 12]) {
                if (pos != 0) tempGuid += "-";
                tempGuid += guid.substr(pos, i).toLowerCase();
                pos += i;
            }
            this.value = tempGuid;
        } else if (!guid) {
            this.value = Guid.random();
        } else throw new TypeError("Invalid GUID string given; cannot instantiate!")
    }

    /** Compares one Guid instance with another */
    public equals(other: Guid): boolean {
        return Guid.isValid(other) && this.value === other.toString();
    }

    public isEmpty(): boolean {
        return this.value === Guid.EMPTY;
    }

    /** Returns the hyphenated GUID */
    public toString(): string {
        return this.value;
    }

    /** Returns the non-hyphenated GUID */
    public toShortString(): string {
        return this.value.replace(/-/g, "");
    }
}
