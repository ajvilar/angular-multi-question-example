import { IOptions, IQuestionInfo } from './components/multi-question/multi-question.component';
  
const yesNoOptions: Array<IOptions> = [
  { key: 'Y', value: 'Yes' },
  { key: 'N', value: 'No' }
];

const yesNoDont_KnownOptions: Array<IOptions> = [
  { key: 'Y', value: 'Yes' },
  { key: 'N', value: 'No' },
  { key: 'U', value: "Don't Know" },
];

export const testQuestions: Array<IQuestionInfo> = [
    {
      key: '1', text: 'first question', choice: '', options: yesNoOptions, show: true,
      rules: {always: true}
    },
    {
      key: '2', text: 'second question', choice: '', options: yesNoDont_KnownOptions, show: true,
      rules: {
        dependsOn: ['1'], // only show this question if the following are visible
        choiceRules: {
          '1': ['N'],  // only show if question '3' has a value of 'N'
        },
      }
    },
    {
      key: '3', text: 'third question', choice: '', options: yesNoOptions, show: true,
      rules: {
        dependsOn: ['2'], // only show this question if the following are visible
        choiceRules: {
          '2': ['Y', 'U'],  // only show if question '3' has a value of 'N'
        },
      }
    },
    {
      key: '4',
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