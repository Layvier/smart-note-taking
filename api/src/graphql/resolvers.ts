import { autocompleteText } from '../gpt3';
import { APIQueryResolvers } from './types';

const Query: APIQueryResolvers = {
  autocomplete(obj: any, { payload }) {
    return autocompleteText({
      title: payload.title || undefined,
      sources: payload.sources || [],
      inputText: payload.inputText,
    });
  },
  generateQuestions(obj: any, { payload }) {
    return ['Question 1?', 'Question 2?'];
  },
};

export default {
  Query,
};
