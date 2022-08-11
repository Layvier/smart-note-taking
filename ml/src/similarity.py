
from sentence_transformers import SentenceTransformer, util
import nltk.data

tokenizer = nltk.data.load('tokenizers/punkt/english.pickle')


# Create enbedding for each sentence, including the input text
# Measure the similarity between each sentence and the input text
# Pick the top 3 sentences with the highest similarity, and selected the paragraphs around these sentences
# Return the top 3 paragraphs
def get_relevant_paragraphs(input_text, source_documents, 
                            similarity_treshold= 0,
max_contexts_per_document=3):
    """
    TODO: Should accept several documents, and return the paragraphs that are most similar to the input text, as
    well as their similarity, the index of quoted source document and the index of the start of the paragraph in the source document.
    """
    
    
    model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
    input_text_embedding = model.encode(input_text, convert_to_tensor=True)
    
    contexts = []
    for source_document_index in range(len(source_documents)):
        source_document = source_documents[source_document_index]
        sentences = tokenizer.tokenize(source_document)
        source_doc_sentences_embeddings = model.encode(sentences, convert_to_tensor=True)
        
        
        

        similarities= map(lambda source_doc_sentence_embedding:  util.pytorch_cos_sim(input_text_embedding, source_doc_sentence_embedding).item(), source_doc_sentences_embeddings)

        # max_index = similarities.index(max(similarities))
        # most_similar_sentence = sentences[max_index]

        most_similar_sentences = sorted(zip(similarities, range(len(sentences)), sentences), reverse=True)[:max_contexts_per_document]
        most_similar_sentences_above_threshold = list(filter(lambda x: x[0] > similarity_treshold, most_similar_sentences))
        for i in range(len(most_similar_sentences_above_threshold)):
            _similarity, index, sentence = most_similar_sentences_above_threshold[i]
            context = ' '.join([sentences[index -1] if index > 0 else '', sentence, sentences[index + 1] if index < len(sentences) -1 else ''])
            character_index = source_document.find(sentences[index -1] if index > 0 else sentence)
            contexts.append({'context': context, 'similarity': _similarity, 'document_index': source_document_index, 'character_index': character_index})
            
    return contexts