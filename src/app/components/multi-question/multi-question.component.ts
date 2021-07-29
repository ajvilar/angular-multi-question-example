import { Component, Input, OnInit, VERSION } from '@angular/core';
import { IOptions, IQuestionMetaInfo, IRule, MultiQuestionUtility } from './multiquestion-utility';
import { questions } from './questions';

const yesNoOptions: Array<IOptions> = [
  { key: 'Y', value: 'Yes' },  // keys = ['Y', 'N], values = ['Yes', 'No'], entries = [['Y', 'Yes'], ['N', 'No']]
  { key: 'N', value: 'No' }
];

const yesNoDont_KnownOptions: Array<IOptions> = [
  { key: 'Y', value: 'Yes' },
  { key: 'N', value: 'No' },
  { key: 'U', value: "Don't Know" },
];

@Component({
  selector: 'multi-question',
  templateUrl: './multi-question.component.html',
  styleUrls: [ './multi-question.component.css' ]
})
export class MultiQuestionComponent implements OnInit  {
  public questions: MultiQuestionUtility;
  public questionChoices: any;

  public constructor() {
    const rules: Array<IRule> = [];

    this.questions = new MultiQuestionUtility(questions, rules);
    this.questionChoices = this.questions.getInitialChoices();
  }

  public ngOnInit() {
    this.questionChoices = this.questions.evalRules(this.questionChoices);
  }

  public onChange(e: any) {
    this.questionChoices = this.questions.evalRules(this.questionChoices);
  }

  public get diagnostics() {
    return JSON.stringify(this.questionChoices);
  }}