/*
 * The content of this file is copied from
 * `typesafe-actions/dist/is-action-of.d.ts` and
 * `typesafe-actions/dist/types.d.ts` because these could not be resolved in the
 * Travis build.
 */

export type StringType = string
export type SymbolType = symbol

export type StringOrSymbol = StringType | SymbolType

export interface TypeMeta<T extends StringOrSymbol> {
  getType?: () => T
}

export type AC<
  T extends {
    type: string
  }
> = ((...args: any[]) => T) & TypeMeta<T['type']>
