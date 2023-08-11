import { Card } from './Card';
import { FC, useEffect, useState } from 'react';
import { Wish } from '../models/Wish';
import * as web3 from '@solana/web3.js';
import { WishCoordinator } from '../coordinators/WishCoordinator';
import { Button, Center, HStack, Input, Spacer, Text } from '@chakra-ui/react';

export const WishList: FC = () => {
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'));
    const [wishes, setWishes] = useState<Wish[]>([]);
    const [page, setPage] = useState(1);
    const [isWishesLoading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        setLoading(true);
        WishCoordinator.fetchPage(connection, page, 5, search, search !== '').then((wishes) => {
            setWishes(wishes);
            setLoading(false);
        });
    }, [page, search]);

    return (
        <div>
            <Center>
                <Input
                    id='search'
                    color='gray.400'
                    onChange={(event) => setSearch(event.currentTarget.value)}
                    placeholder='Search'
                    w='97%'
                    mt={2}
                    mb={2}
                />
            </Center>
            {isWishesLoading ? (
                <Center>
                    <Text>Loading...</Text>
                </Center>
            ) : (
                wishes.map((wish, i) => <Card key={i} wish={wish} />)
            )}
            <Center>
                <HStack w='full' mt={2} mb={8} ml={4} mr={4}>
                    {page > 1 && <Button onClick={() => setPage(page - 1)}>Previous</Button>}
                    <Spacer />
                    {WishCoordinator.accounts.length > page * 5 && (
                        <Button onClick={() => setPage(page + 1)}>Next</Button>
                    )}
                </HStack>
            </Center>
        </div>
    );
};
