import { When, Then } from 'cucumber';

When('I compile the file using typescript', function() {
    this.context.webpackConfigFileName = 'webpack.config.ts';
    this.context.isTypescript = true;
    this.tsIssues = this.runTypescript();
});

Then('there should be {int} typescript issue', function(issueCount) {
    if (this.tsIssues.length !== issueCount) {
        throw new Error(
            `Expected ${issueCount} issues, but got ${this.tsIssues.length}`
        );
    }
});

Then('the first issue should be {string}', function(issueMessage) {
    if (this.tsIssues[0] !== issueMessage) {
        throw new Error(
            `Expected ${issueMessage} issues, but got ${this.tsIssues[0]}`
        );
    }
});
