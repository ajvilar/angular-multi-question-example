import { IOptions, IQuestionMetaInfo } from './multiquestion-utility';
  
const yesNoOptions: Array<IOptions> = [
  { key: 'Y', value: 'Yes' },
  { key: 'N', value: 'No' }
];

const yesNoDont_KnownOptions: Array<IOptions> = [
  { key: 'Y', value: 'Yes' },
  { key: 'N', value: 'No' },
  { key: 'U', value: "Don't Know" },
];

export const questions: Array<IQuestionMetaInfo> = [
    {
      key: 'question1', text: 'first question', choice: '', options: yesNoOptions, show: true,
      rules: {always: true}
    },
    {
      key: 'question2', text: 'second question', choice: '', options: yesNoDont_KnownOptions, show: false,
      rules: {
        dependsOn: ['question1'], // only show this question if the following are visible
        choiceRules: {
          'question1': ['Y'],  // only show if question 'question1' has a value of 'Y'
        },
      }
    },
    {
      key: 'question3', text: 'third question', choice: '', options: yesNoOptions, show: true,
      rules: {
        dependsOn: ['question1'], // only show this question if the following are visible
        choiceRules: {
          '2': ['Y', 'U'],  // only show if question '3' has a value of 'N'
        },
      }
    },
    {
      key: 'question4',
      text: 'fourth question', 
      choice: '', 
      options: yesNoOptions,
      rules: {
        dependsOn: ['3'], // only show this question if the following are visible
        choiceRules: {
          '3': ['N'],  // only show if question '3' has a value of 'N'
        },
      },
      show: true
    }
  ];