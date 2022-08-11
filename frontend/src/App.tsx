import { ChakraProvider, Flex, Input, Spinner, Stack, theme } from '@chakra-ui/react';
import { useState } from 'react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Editor } from './components/Editor';
import { SourceDocument, SourceDocuments } from './components/SourceDocuments';

export const App = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sourceDocuments, setSourceDocuments] = useState<SourceDocument[]>([]);

  // onShiftEnter = () => {
  //     autocompleteLazyQuery({
  //       variables: {
  //         title: title || undefined,
  //         sources: sourceDocuments.map(
  //           ({ name, content }) => `${name}:
  //         ${content}`
  //         ),
  //         inputText: debouncedContent,
  //       },
  //     });
  // }

  return (
    <ChakraProvider theme={theme}>
      <Flex direction="column" minH="100vh" w="100%" alignItems="stretch" p={2}>
        <Flex direction="row-reverse">
          <ColorModeSwitcher justifySelf="flex-end" />
        </Flex>
        <Stack spacing={16} px={20}>
          <Flex direction="row" justifyContent="space-between">
            <Flex w="40%" mr={5}>
              <Input
                size="lg"
                variant="flushed"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                placeholder="Title"
              />
            </Flex>

            <Flex w="40%" mr={5}>
              <SourceDocuments
                sourceDocuments={sourceDocuments}
                onChange={(sourceDocs) => setSourceDocuments(sourceDocs)}
              />
            </Flex>
          </Flex>
          <Editor content={content} setContent={setContent} title={title} sourceDocuments={sourceDocuments} />
        </Stack>
      </Flex>
    </ChakraProvider>
  );
};
