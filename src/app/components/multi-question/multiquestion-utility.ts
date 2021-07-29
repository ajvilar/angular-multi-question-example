export interface IOptions {
  key: string;
  value: string;
} 

export interface IQuestionMetaInfo {
  options: Array<IOptions>;
  key:string;
  text:string;
  choice:string;
  show:boolean;
  args?: any;
  rules?: any;
  saveHiddenValues?: boolean
  preserveHiddenValue?: boolean;
}

export interface IRule {
  type: string;
  args: any;
}

export class MultiQuestionUtility {
  private questionDefinitions: Map<string, IQuestionMetaInfo>;

  constructor(questionDefinitions: any, rules?: Array<IRule>) {
      this.questionDefinitions = new Map();

      if(Array.isArray(questionDefinitions)) {
        questionDefinitions.forEach(def => {
          this.questionDefinitions.set(def.key, def);
        });
      }
  }


  public saveHiddenValues: boolean = false;

  public dwellingType = '';

  public showQuestion(key: string): boolean {
    const options =  this.questionDefinitions.get(key)?.show;
    return options || false;
  }
  
  public getOptions(key: string): Array<IOptions> {
      // Optional chaining ?. only evaluates if the preceding object is not null
    const options =  this.questionDefinitions.get(key)?.options;

    return options || [];  // if options is not null will return options, otherwise and empty array
  }

  public getInitialChoices() {
    const val: any = {};

    for(const key of this.questionDefinitions.keys()) {
      val[key] = "";
    }

    return val;
  }

  public getStringValue(key: string): string {
    return "translated: " + key;
  }

  private getQuestionInfoByKey(key: string): IQuestionMetaInfo|undefined {
    return this.questionDefinitions.get(key);
  } 

  public evalRules(choiceValues: any): any {
    for(const entry of this.questionDefinitions.entries()) {
      const [questionKey, question] = entry;
      if('rules' in question) {
        const rules = question.rules;
        //If 'always', evaluate first
        if('always' in rules) {
          question.show = rules.always;
          continue;
        }

        let show: boolean = true;
        //Default to show questions is true, unless 'dependsOn' makes it false
        if ('dependsOn' in rules) {
          const dependsOn: Array<string> = rules.dependsOn;

          for(let key of dependsOn) {
            if(key == question.key) {
              // TODO - an obvious error add behaivor for depends on itself
              continue;  // for right now just ignore
            }
            const dependsOnQuestionInfo = this.getQuestionInfoByKey(key);
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
              if(!choiceRules[key].includes(choiceValues[key])) {
                show = false;
                break;
              }
            }
          }

          //Clear values of questions not shown
          question.show = show;
          const saveHidden = this.saveHiddenValues || question.saveHiddenValues;
          if(!saveHidden && show === false) {
            choiceValues[questionKey] = '';
          }
        }
      }
    }
     // set the dwellingType here
     const  isHouse = false; // 
     this.dwellingType = (isHouse)?'house':'appartment';
     
     return choiceValues;
  }
} 