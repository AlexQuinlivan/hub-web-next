import {useActionDeferred} from "@/app/hooks/arch/useActionDeferred";
import {LoadChildrenAction} from "@/app/modules/children/domain/actions/LoadChildrenAction";
import {ChildrenStore} from "@/app/modules/children/domain/stores/ChildrenStore";
import {observer} from "mobx-react-lite";
import {container} from "tsyringe";
import {useMemo} from "react";

export const ChildrenList = observer(() => {
  const {children} = container.resolve(ChildrenStore)
  const [loadChildren, isWorking, loadError] = useActionDeferred(LoadChildrenAction)

  useMemo(() => {
    void loadChildren(undefined)
  }, [])

  // if (children.size == 0 && isWorking) {
  //   return <p>Loading</p>
  // }
  //
  // if (children.size == 0 && loadError) {
  //   return <Typography>Error</Typography>
  // }

  return (
    <>
      mobx + tsyringe + arch components:
      <br/>
      {isWorking && <p>Working</p>}
      {loadError && <p>{loadError.message}</p>}
      <ul>
        {
          [...children].map(([id, child]) => (
            <li key={id}>
              {child.display_name}
            </li>
          ))
        }
      </ul>
    </>
  );
});