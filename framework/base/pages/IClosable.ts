export interface IClosable {
    waitForClose(): Promise<void>
}