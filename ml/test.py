from src.similarity import get_relevant_paragraphs

input_text = 'As a consequence of these constant wars the army was very expensive to maintain, and thus the Empire became crippled with debts. '

with open('src/source_doc1.txt', 'r') as file:
    source_doc = file.read().replace('\n', '')
    
    paragraphs = get_relevant_paragraphs(input_text, source_doc, 1)
    for paragraph in paragraphs:
        print('=======')
        print(paragraph)