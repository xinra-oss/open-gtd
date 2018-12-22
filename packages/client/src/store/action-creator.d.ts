/*
 * The content of this file is copied from
 * `typesafe-actions/dist/is-action-of.d.ts` and
 * `typesafe-actions/dist/types.d.ts` because these could not be resolved in the
 * Travis build.
 */

export declare type StringType = string
export declare type SymbolType = symbol

export declare type StringOrSymbol = StringType | SymbolType

export declare interface TypeMeta<T extends StringOrSymbol> {
  getType?: () => T
}

export declare type AC<
  T extends {
    type: string
  }
> = ((...args: any[]) => T) & TypeMeta<T['type']>
