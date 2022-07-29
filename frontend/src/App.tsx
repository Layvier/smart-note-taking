import { gql, useLazyQuery } from '@apollo/client';
import { Box, ChakraProvider, Flex, Input, Stack, Textarea, theme } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { SourceDocument, SourceDocuments } from './components/SourceDocuments';
import { useDebounce } from './useDebounce';

const autocompleteQuery = gql`
  query autocomplete($title: String, $sources: [String!]!, $inputText: String!) {
    autocomplete(payload: { title: $title, sources: $sources, inputText: $inputText })
  }
`;

export const App = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sourceDocuments, setSourceDocuments] = useState<SourceDocument[]>([]);
  const [autocomplete, setAutocomplete] = useState('');
  const debouncedContent = useDebounce<string>(content, 500);

  const [autocompleteLazyQuery] = useLazyQuery(autocompleteQuery, {
    onCompleted(data) {
      console.log(data);
      setAutocomplete(data.autocomplete.replace(/[\r\n]/gm, ''));
    },
  });

  useEffect(() => {
    if (debouncedContent) {
      setAutocomplete('');
      autocompleteLazyQuery({
        variables: {
          title: title || undefined,
          sources: ['Source 1'],
          inputText: debouncedContent,
        },
      });
    }
  }, [debouncedContent, autocompleteLazyQuery]);

  const onPressTab = () => {
    if (autocomplete) {
      const hasSpaceFirst = autocomplete[0] === ' ';
      const words = autocomplete.trim().split(' ');
      const nextWord = words.shift();
      setContent((c) => c + (hasSpaceFirst ? ' ' : '') + nextWord);
      setAutocomplete(' ' + words.join(' '));
    }
  };
  return (
    <ChakraProvider theme={theme}>
      <Flex direction="column" minH="100vh" w="100%" alignItems="stretch" p={2}>
        <Flex direction="row-reverse">
          <ColorModeSwitcher justifySelf="flex-end" />
        </Flex>
        <Stack spacing={20} px={20}>
          <Flex>
            <Flex w="60%" mr={5}>
              <Input
                size="lg"
                variant="flushed"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                placeholder="Title"
              />
            </Flex>

            <SourceDocuments
              sourceDocuments={sourceDocuments}
              onChange={(sourceDocs) => setSourceDocuments(sourceDocs)}
            />
          </Flex>
          <Flex direction="column">
            <Box position="relative">
              <Textarea
                position="absolute"
                onChange={(e) => setContent(e.target.value)}
                value={content}
                minH="100px"
                placeholder="Write your note..."
                onKeyDown={(e) => {
                  if (e.key === 'Tab') {
                    onPressTab();
                    e.preventDefault();
                  }
                }}
              ></Textarea>
              {content && debouncedContent && autocomplete && (
                <Box position="absolute" left="17px" top="8px" color="gray.600">
                  {content + autocomplete}
                </Box>
              )}
            </Box>
            {/* <Text color="gray.500">
              {(debouncedContent && data?.autocomplete) || "..."}
            </Text> */}
          </Flex>
          <Flex></Flex>
        </Stack>
      </Flex>
    </ChakraProvider>
  );
};
