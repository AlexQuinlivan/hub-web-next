/** An action is responsible for performing the manipulation of application state */
export interface Action<Parameter = unknown> {
  execute(param: Parameter): Promise<void>
}