import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "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",
});
console.log(process.env.OPENAI_API_KEY);
const openai = new OpenAIApi(configuration);

export const autocompleteText = async ({
  title,
  sources,
  inputText,
}: {
  title?: string;
  sources: string[];
  inputText: string;
}): Promise<string> => {
  const sourcesPrompt = sources.map(
    (source) => `Source 1:
  ${source}
  `
  ).join(`
  
  ========

  `);
  const prompt = `
  ${sourcesPrompt}
  
  Below is a study note${title ? " about " + title : ""}
  =======

  ${inputText}`;
  console.log(prompt);
  const response = await openai.createCompletion({
    model: "text-davinci-002",
    prompt,
    temperature: 0,
    max_tokens: 20,
  });
  if (!response.data.choices[0].text) throw new Error("no results from gpt3");
  console.log(response.data.choices);
  return response.data.choices[0].text;
};
