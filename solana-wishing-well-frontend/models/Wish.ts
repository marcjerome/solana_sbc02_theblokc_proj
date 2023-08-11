import * as borsh from '@project-serum/borsh'

export class Wish {
    name: string;
    wish: string;

    constructor(name: string, wish: string) {
        this.name = name;
        this.wish = wish;
    }

    static mocks: Wish[] = [
        new Wish('TestName', 'Test Wish')
    ]

    borshInstructionSchema = borsh.struct([
        borsh.u8('variant'),
        borsh.str('name'),
        borsh.str('wish'),
    ])

    static borshAccountSchema = borsh.struct([
        borsh.bool('initialized'),
        borsh.str('name'),
        borsh.str('wish'),
    ])

    serialize(): Buffer {
        const buffer = Buffer.alloc(1000)
        this.borshInstructionSchema.encode({ ...this, variant: 0 }, buffer)
        return buffer.slice(0, this.borshInstructionSchema.getSpan(buffer))
    }

    static deserialize(buffer?: Buffer): Wish | null {
        if (!buffer) {
            return null
        }

        try {
            const { name, wish } = this.borshAccountSchema.decode(buffer)
            return new Wish(name, wish)
        } catch (e) {
            console.log('Deserialization error:', e)
            console.log(buffer)
            return null
        }
    }
}