import { Component, Input, OnInit, VERSION } from '@angular/core';

export interface IOptions {
  key: string;
  value: string;
} 

export interface IQuestionInfo {
  key: string;
  text: string;
  choice: string;
  options: Array<IOptions>;
  show: boolean;
  rules?: any;
}

@Component({
  selector: 'multi-question',
  templateUrl: './multi-question.component.html',
  styleUrls: [ './multi-question.component.css' ]
})
export class MultiQuestionComponent implements OnInit  {
  name = 'Angular ' + VERSION.major;

  @Input()
  public questions: Array<IQuestionInfo> = [];

  @Input()
  public saveHiddenValues: boolean = false;

  constructor() {
  }

  ngOnInit() {
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