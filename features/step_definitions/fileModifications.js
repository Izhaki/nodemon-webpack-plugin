import { defineSupportCode } from 'cucumber';

defineSupportCode(({ When }) => {
  When('the entry file is modified', function () {
    this.renderEntryFile();
  });

  When('a file unrelated to the entry file is modified', function () {
    this.renderUnrelatedFile();
  });
});
