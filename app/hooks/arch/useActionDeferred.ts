import {useAction} from "@/app/hooks/arch/useAction";
import {Action} from "@/app/utilities/arch/Action";
import {InjectionToken} from "tsyringe";
import {useCallback, useState} from "react";

export const useActionDeferred = <Parameter>(action: InjectionToken<Action<Parameter>>) => {
  const [isWorking, setWorking] = useState(false)
  const [error, setError] = useState(null as Error | null)
  const handler = useAction(action)

  const deferredHandler = useCallback(
    async (param: Parameter) => {
      try {
        setError(null)
        setWorking(true)
        await handler(param)
      } catch (error) {
        if (typeof error === "string") {
          setError(new Error(error))
        } else if (error instanceof Error) {
          setError(error)
        } else {
          setError(new Error(`UnknownError`))
        }
      } finally {
        setWorking(false)
      }
    },
    [handler]
  )

  return [deferredHandler, isWorking, error] as const
};