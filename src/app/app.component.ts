import { Component, VERSION } from '@angular/core';

interface IOptions {
  key: string;
  value: string;
} 

interface IQuestionInfo {
  key: string;
  text: string;
  choice: string;
  options: Array<IOptions>;
  show: boolean;
  rules?: any;
}
  
const yesNoOptions: Array<IOptions> = [
  { key: 'Y', value: 'Yes' },
  { key: 'N', value: 'No' }
];

const yesNoDont_KnownOptions: Array<IOptions> = [
  { key: 'Y', value: 'Yes' },
  { key: 'N', value: 'No' },
  { key: 'U', value: "Don't Know" },
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name = 'Angular ' + VERSION.major;

  public questions: Array<IQuestionInfo> = [
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

  public saveHiddenValues: boolean = false;

  constructor() {
    this.evaluateRules(); 
  }

  onChange(){
    this.evaluateRules();
  }

  private getQuestionInfoByKey(key: string): IQuestionInfo|null {
    for(let question of this.questions) {
      if(key === question.key) {
        return question;
      }
    }
    return null;
  } 

  private evaluateRules() {
    this.questions.forEach((question: IQuestionInfo) => {
      if('rules' in question) {
        const rules = question.rules;

        if('always' in rules) {
          question.show = rules.always;
          return;
        }

        let show: boolean = true;

        if ('dependsOn' in rules) {
          const dependsOn: Array<string> = rules.dependsOn;

          for(let key of dependsOn) {
            if(key == question.key) {
              // TODO - an obvious error add behaivor for depends on itself
              continue;  // for right now just ignore
            }
            const dependsOnQuestionInfo: IQuestionInfo|null = this.getQuestionInfoByKey(key);
            if(dependsOnQuestionInfo) {
              if(dependsOnQuestionInfo.show == false) {
                show = false;
                break;
              }
            } else {
              // TODO - add behaivor for a rule with no match
            }
          }

          if(show && 'choiceRules' in rules) {
            const choiceRules: any = rules.choiceRules;
            for(let key of Object.keys(choiceRules)) {
              if(key == question.key) {
                // TODO - an obvious error add behaivor for depends on itself
                continue;  // for right now just ignore
              }
              const dependsOnQuestionInfo: IQuestionInfo|null = this.getQuestionInfoByKey(key);
              if(dependsOnQuestionInfo) {
                if(!choiceRules[key].includes(dependsOnQuestionInfo.choice)) {
                  show = false;
                  break;
                }
              } else {
                // TODO - add behaivor for a rule with no match
              }
            }
          }

          question.show = show;
          if(!this.saveHiddenValues && show === false) {
            question.choice = '';
          }
        }
        }
    });
  }
}