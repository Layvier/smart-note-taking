import { Configuration, OpenAIApi } from 'openai';
import { env } from './env';
import { getRelevantContexts } from './ml.service';

const configuration = new Configuration({
  apiKey: env.OTHER.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

function wordFreq(s: string) {
  return s
    .replace(/[.]/g, '')
    .split(/\s/)
    .reduce(
      (map, word) =>
        Object.assign(map, {
          [word]: map[word] ? map[word] + 1 : 1,
        }),
      {}
    );
}

export const autocompleteText = async ({
  title,
  sources,
  inputText,
}: {
  title?: string;
  sources: string[];
  inputText: string;
}): Promise<string> => {
  // const inputWords = inputText.replace(/[.]/g, '').split(/\s/);

  // const frequencies = sources.map(source => {
  //   const s = source.replace(/[.]/g, '').split(/\s/);
  //   console.log(s);
  //   return s.reduce(
  //     (map, word) =>
  //       inputWords.includes(word)
  //         ? Object.assign(map, {
  //             [word]: map[word] ? map[word] + 1 : 1,
  //           })
  //         : map,
  //     {}
  //   );
  // });

  const relevant_contexts = await getRelevantContexts(inputText, sources);
  const sourcesPrompt = relevant_contexts.map(({ context }) => `${context}`).join(`
  ---
  `);
  const prompt = `
  ${sourcesPrompt}

  Below is a study note${title ? ' about ' + title : ''}

  ${inputText}`;
  console.log(prompt);
  const response = await openai.createCompletion({
    model: 'text-davinci-002',
    prompt,
    temperature: 0,
    max_tokens: 20,
  });
  if (!response.data?.choices) return '';
  if (!response.data?.choices[0].text) throw new Error('no results from gpt3');
  return response.data.choices[0].text;
};
