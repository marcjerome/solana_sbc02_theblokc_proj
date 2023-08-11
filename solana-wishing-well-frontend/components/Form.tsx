import { FC } from 'react'
import { Wish } from '../models/Wish'
import { useState } from 'react'
import { Box, Button, FormControl, FormLabel, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Textarea } from '@chakra-ui/react'
import * as web3 from '@solana/web3.js'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'

const WISH_PROGRAM_ID = '9gUaPyV7fuPGGpqtz5gxMkrhbsScsm1gZ8cvp7ipGymA'

export const Form: FC = () => {
    const [name, setName] = useState('')
    const [wish, setWish] = useState('')
    const [description, setDescription] = useState('')

    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const handleSubmit = (event: any) => {
        event.preventDefault()
        const _wish = new Wish(name, wish)
        handleTransactionSubmit(_wish)
    }

    const handleTransactionSubmit = async (wish: Wish) => {
        if (!publicKey) {
            alert('Please connect your wallet!')
            return
        }

        const buffer = wish.serialize()
        const transaction = new web3.Transaction()

        const [pda] = await web3.PublicKey.findProgramAddress(
            [publicKey.toBuffer(), Buffer.from(wish.name)],// new TextEncoder().encode(movie.title)],
            new web3.PublicKey(WISH_PROGRAM_ID)
        )

        const instruction = new web3.TransactionInstruction({
            keys: [
                {
                    pubkey: publicKey,
                    isSigner: true,
                    isWritable: false,
                },
                {
                    pubkey: pda,
                    isSigner: false,
                    isWritable: true
                },
                {
                    pubkey: web3.SystemProgram.programId,
                    isSigner: false,
                    isWritable: false
                }
            ],
            data: buffer,
            programId: new web3.PublicKey(WISH_PROGRAM_ID)
        })

        transaction.add(instruction)

        try {
            let txid = await sendTransaction(transaction, connection)
            alert(`Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`)
            console.log(`Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`)
        } catch (e) {
            console.log(JSON.stringify(e))
            alert(JSON.stringify(e))
        }
    }

    return (
        <Box
            p={4}
            display={{ md: "flex" }}
            maxWidth="32rem"
            borderWidth={1}
            margin={2}
            justifyContent="center"
        >
            <form onSubmit={handleSubmit}>
                <FormControl isRequired>
                    <FormLabel color='black'>
                        Your Name:
                    </FormLabel>
                    <Input
                        id='name'
                        color='black'
                        onChange={event => setName(event.currentTarget.value)}
                    />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel color='black'>
                        Add your wish
                    </FormLabel>
                    <Textarea
                        id='wish'
                        color='black'
                        onChange={event => setWish(event.currentTarget.value)}
                    />
                </FormControl>
                <Button width="full" mt={4} type="submit" style={{backgroundColor: "#FECD45 "}}>Make a Wish</Button>
            </form>
        </Box>
    );
}