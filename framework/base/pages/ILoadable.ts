export interface ILoadable {
  waitForLoad(): Promise<this>;
}
