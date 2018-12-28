/**
 * This is used as a return type/value for endpoints that not actually return
 * anything. This is needed because every handler must either return something
 * or call `res.send()` manually. See https://github.com/hmil/rest.ts/issues/6
 */
export const EmptyResponse = 'OK'
export type EmptyResponse = typeof EmptyResponse
