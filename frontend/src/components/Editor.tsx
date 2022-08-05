import { gql, useLazyQuery } from '@apollo/client';
import { Box, Flex, FormControl, FormLabel, Spinner, Stack, Switch, Textarea, TextareaProps } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useDebounce } from '../useDebounce';
import { SourceDocument } from './SourceDocuments';
import 'react-quill/dist/quill.snow.css';

// ReactQuill.Quill.register('modules/test', (quill: any, options: any) => {
//   return quill;
// });

const autocompleteQuery = gql`
  query autocomplete($title: String, $sources: [String!]!, $inputText: String!) {
    autocomplete(payload: { title: $title, sources: $sources, inputText: $inputText })
  }
`;

// const useAutocomplete = ({
//   inputText,
//   title,
//   sourceDocuments,
// }: {
//   inputText: string;
//   title: string;
//   sourceDocuments: SourceDocument[];
//   autoTriggered: boolean
// }) => {
//   return {
//     trigger: () => null
//   }
// };

interface EditorProps {
  content: string;
  setContent: (content: string) => void;
  title: string;
  sourceDocuments: SourceDocument[];
}

export const Editor: React.FC<EditorProps> = ({ content, setContent, title, sourceDocuments }) => {
  const [queriedInputText, setQueriedInputText] = useState<string>();
  const [autocompleteEnabled, setAutocompleteEnabled] = useState<boolean>(false);

  const [autocomplete, setAutocomplete] = useState('');

  const debouncedContent = useDebounce<string>(content, 500);

  const [autocompleteLazyQuery, { loading }] = useLazyQuery(autocompleteQuery, {
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      if (content === queriedInputText) {
        setAutocomplete(data.autocomplete.replace(/[\r\n]/gm, ''));
      }
    },
  });

  const onChange = (value: string) => {
    setAutocomplete('');
    setContent(value);
  };

  const onPressTab = () => {
    if (autocomplete) {
      let wordStarted = false;
      let wordFinished = false;
      const nextWord = autocomplete.split('').reduce((acc, char) => {
        if (wordStarted && char === ' ') {
          wordFinished = true;
        }
        if (wordFinished) return acc;
        if (!wordStarted && char !== ' ') {
          wordStarted = true;
        }
        return acc + char;
      }, '');
      setContent(content + nextWord);
      setAutocomplete(autocomplete.slice(nextWord.length));
    }
  };

  const onShiftEnter = () => {
    setQueriedInputText(debouncedContent);
    autocompleteLazyQuery({
      variables: {
        title: title || undefined,
        sources: sourceDocuments.map(
          ({ name, content }) => `${name}:
              ${content}`
        ),
        inputText: debouncedContent,
      },
    });
  };

  useEffect(() => {
    if (debouncedContent && autocompleteEnabled) {
      // setAutocomplete('');
      setQueriedInputText(debouncedContent);
      autocompleteLazyQuery({
        variables: {
          title: title || undefined,
          sources: sourceDocuments.map(
            ({ name, content }) => `${name}:
              ${content}`
          ),
          inputText: debouncedContent,
        },
      });
    }
  }, [debouncedContent, autocompleteLazyQuery]);

  const textareaProps: TextareaProps = {
    position: 'absolute',
    minH: '400px',
  };

  return (
    <Flex direction="column">
      <Flex direction="row-reverse" p={1} pb={3} minH="32px">
        {loading && <Spinner size="sm" color="gray.400" />}
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="enable-autocomplete" mb="0">
            Enable autocomplete
          </FormLabel>
          <Switch
            id="enable-autocomplete"
            isChecked={autocompleteEnabled}
            onChange={(e) => setAutocompleteEnabled(!autocompleteEnabled)}
          />
        </FormControl>
      </Flex>
      <Box position="relative">
        {/* <ReactQuill
          placeholder="Write your note..."
          modules={{
            toolbar: [
              [{ header: '1' }, { header: '2' }, { font: [] }],
              [{ size: [] }],
              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
              [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
              ['link', 'image', 'video'],
              ['clean'],
            ],
            clipboard: {
              // toggle to add extra line breaks when pasting HTML:
              matchVisual: false,
            },
            // test: {},
          }}
          theme="snow"
          value={content}
          onChange={(value) => onChange(value)}
        /> */}
        <Textarea
          {...textareaProps}
          zIndex={1}
          onChange={(e) => onChange(e.target.value)}
          value={content}
          placeholder="Write your note..."
          onKeyDown={(e) => {
            if (e.key === 'Tab') {
              onPressTab();
              e.preventDefault();
            }
            if (e.key === 'Enter' && e.shiftKey) {
              onShiftEnter();
              e.preventDefault();
            }
          }}
        />
        {content && debouncedContent && autocomplete && (
          <Textarea
            {...textareaProps}
            color="gray.600"
            defaultValue={`${content}${autocomplete}`}
            placeholder="Write your note..."
          />
        )}
      </Box>
    </Flex>
  );
};
