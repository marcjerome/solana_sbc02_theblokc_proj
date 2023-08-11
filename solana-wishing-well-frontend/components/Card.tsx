import { Box, HStack, Spacer, Stack, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { Wish } from '../models/Wish';

export interface CardProps {
    wish: Wish;
}

export const Card: FC<CardProps> = (props) => {
    return (
        <Box
            p={4}
            display={{ md: "flex" }}
            maxWidth="32rem"
            borderWidth={1}
            margin={2}
        >
            <Stack
                w='full'
                align={{ base: "center", md: "stretch" }}
                textAlign={{ base: "center", md: "left" }}
                mt={{ base: 4, md: 0 }}
                ml={{ md: 6 }}
                mr={{ md: 6 }}
            >
                <HStack >
                    <Text
                        fontWeight="bold"
                        textTransform="uppercase"
                        fontSize="lg"
                        letterSpacing="wide"
                        color="black"
                    >
                        {props.wish.name}
                    </Text>
                    <Spacer />
                </HStack>
                <Text my={2} color="black">
                    <span style={{ fontWeight: "bold" }}>Wish:</span> {props.wish.wish}
                </Text>
            </Stack>
        </Box>
    )
}

