import fetch from 'cross-fetch';

export const getRelevantContexts = async (
  inputText: string,
  sourceDocuments: string[]
): Promise<
  Array<{
    similarity: number;
    context: string;
    document_index: number;
    character_index: number;
  }>
> => {
  try {
    const response = await fetch(`${process.env.ML_BASE_URL}/api/relevant_contexts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input_text: inputText,
        source_documents: sourceDocuments,
        similarity_treshold: 0.45,
        max_contexts_per_document: 2,
      }),
    });
    const { items } = await response.json();
    return items;
  } catch (error) {
    console.error(error);
    return [];
  }
};
