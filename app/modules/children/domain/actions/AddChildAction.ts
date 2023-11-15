import {LoadChildrenAction} from "@/app/modules/children/domain/actions/LoadChildrenAction";
import {ChildrenRepository} from "@/app/modules/children/domain/repositories/ChildrenRepository";
import {Action} from "@/app/utilities/arch/Action";
import {inject, singleton} from "tsyringe";
import {action, makeObservable} from "mobx";

@singleton()
export class AddChildAction implements Action<string> {
  constructor(
    @inject(ChildrenRepository) private readonly childrenRepository: ChildrenRepository,
    @inject(LoadChildrenAction) private readonly loadChildrenAction: LoadChildrenAction
  ) {
    makeObservable(this)
  }

  @action
  async execute(name: string) {
    await this.childrenRepository.createChild(name)
    await this.loadChildrenAction.execute()
  }
}