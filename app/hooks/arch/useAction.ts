import {Action} from "@/app/utilities/arch/Action";
import {container, InjectionToken} from "tsyringe";
import {useCallback} from "react";

export const useAction = <Parameter>(action: InjectionToken<Action<Parameter>>) => {
  const resolved: Action<Parameter> = container.resolve(action);

  const handler = useCallback(
    async (param: Parameter) => {
      await resolved.execute(param)
    },
    [resolved]
  );

  return handler
};