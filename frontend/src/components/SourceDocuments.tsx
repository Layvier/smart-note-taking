import { SmallCloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  Flex,
  Heading,
  IconButton,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";

export interface SourceDocument {
  id: string;
  name: string;
  content: string;
}

export const SourceDocuments: React.FC<{
  sourceDocuments: SourceDocument[];
  onChange: (docs: SourceDocument[]) => void;
}> = ({ sourceDocuments, onChange }) => {
  const [newSourceDocument, setSourceNewDocument] = useState<SourceDocument>({
    id: Math.random().toString(),
    name: "",
    content: "",
  });

  const [selectedSourceDocumentId, setSelectedSourceDocumentId] =
    useState<string>();

  const isNew = selectedSourceDocumentId === newSourceDocument.id;
  const selectedSourceDocument = isNew
    ? newSourceDocument
    : sourceDocuments.find(({ id }) => id === selectedSourceDocumentId);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const openSourceDocumentModal = (sourceDocument: SourceDocument) => {
    setSelectedSourceDocumentId(sourceDocument.id);
    onOpen();
  };
  const editSelectedSourceDocument = (
    id: string,
    update: Partial<SourceDocument>
  ) => {
    if (id === newSourceDocument.id) {
      return setSourceNewDocument((doc) => ({ ...doc, ...update }));
    } else {
      onChange(
        sourceDocuments.map((doc) =>
          doc.id === id ? { ...doc, ...update } : doc
        )
      );
    }
  };
  return (
    <Flex
      direction="column"
      px={6}
      pt={1}
      pb={4}
      borderRadius={5}
      borderWidth={1}
      flexGrow={1}
    >
      <Heading size="md" color="gray.600">
        Source Documents
      </Heading>
      <Stack pl={3} mt={1} spacing={1}>
        {sourceDocuments.map((sourceDocument) => (
          <Flex key={sourceDocument.name} alignItems="center">
            <IconButton
              icon={<SmallCloseIcon />}
              aria-label="remove source document"
              size="xs"
              mr={2}
              onClick={() =>
                onChange(
                  sourceDocuments.filter((doc) => doc.id !== sourceDocument.id)
                )
              }
            />
            <Link onClick={() => openSourceDocumentModal(sourceDocument)}>
              {sourceDocument.name}
            </Link>
          </Flex>
        ))}
      </Stack>
      <Center>
        <Button
          w={20}
          size="xs"
          colorScheme="blue"
          onClick={() => openSourceDocumentModal(newSourceDocument)}
        >
          Add
        </Button>
      </Center>
      {selectedSourceDocument && (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {isNew ? "Add new" : "Edit"} Source Document
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={5}>
                <Input
                  placeholder="Name"
                  size="lg"
                  value={selectedSourceDocument.name}
                  onChange={(e) =>
                    editSelectedSourceDocument(selectedSourceDocument.id, {
                      name: e.target.value,
                    })
                  }
                />
                <Textarea
                  value={selectedSourceDocument.content}
                  onChange={(e) =>
                    editSelectedSourceDocument(selectedSourceDocument.id, {
                      content: e.target.value,
                    })
                  }
                  placeholder="insert the document's content..."
                  size="lg"
                  h="400px"
                />
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              {isNew && (
                <Button
                  colorScheme="blue"
                  ml={3}
                  isDisabled={
                    !newSourceDocument.name || !newSourceDocument.content
                  }
                  onClick={() => {
                    onChange([...sourceDocuments, newSourceDocument]);
                    setSourceNewDocument({
                      id: Math.random().toString(),
                      name: "",
                      content: "",
                    });
                    onClose();
                  }}
                >
                  Save
                </Button>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Flex>
  );
};

// const SourceDocumentModalEditor: React.FC<{
//   sourceDocument: SourceDocument;
//   isOpen?: boolean;
//   isNew?: boolean;
//   onSave: (sourceDocument: SourceDocument) => void;
// }> = ({isOpen}) => {
//     return isOpen ? (

//     ) : null
// };
