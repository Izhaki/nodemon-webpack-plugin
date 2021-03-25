import { Compiler } from 'webpack';
import { Settings as NodemonOptions } from 'nodemon';

export = NodemonPlugin;

declare class NodemonPlugin {
  constructor(options?: NodemonOptions);

  apply(compiler: Compiler): void;
}
