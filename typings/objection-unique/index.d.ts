declare module 'objection-unique' {
  import { Model } from 'objection';

  interface Options {
    identifiers: string[];
    fields: Array<string | string[]>;
  }

  export default function (
    options?: Options
  ): <T extends typeof Model>(model: T) => T;
}
