import { autocompleteText } from "./gpt3";

export default {
  Query: {
    hello(obj: any, { subject }: { subject: string }) {
      return `Hello, ${subject}! from Server`;
    },
    autocomplete(
      obj: any,
      {
        payload,
      }: { payload: { title?: string; sources?: string[]; inputText: string } }
    ) {
      return " autocomplete demo";
      // return autocompleteText({
      //   title: payload.title,
      //   sources: payload.sources || [],
      //   inputText: payload.inputText,
      // });
    },
    generateQuestions(
      obj: any,
      { payload }: { payload: { sources?: string[]; noteContent: string } }
    ) {
      return ["Question 1?", "Question 2?"];
    },
  },
};
