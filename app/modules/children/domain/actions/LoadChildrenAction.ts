import {ChildrenRepository} from "@/app/modules/children/domain/repositories/ChildrenRepository";
import {ChildrenStore} from "@/app/modules/children/domain/stores/ChildrenStore";
import {Action} from "@/app/utilities/arch/Action";
import {inject, singleton} from "tsyringe";
import {action, makeObservable, runInAction} from "mobx";

@singleton()
export class LoadChildrenAction implements Action {
  constructor(
    @inject(ChildrenStore) private readonly childrenStore: ChildrenStore,
    @inject(ChildrenRepository) private readonly childrenRepository: ChildrenRepository
  ) {
    makeObservable(this)
  }

  @action
  async execute() {
    const children =
      new Map(
        (await this.childrenRepository.getChildren())
          .map((child) => [child.id, child])
      )

    runInAction(() => {
      this.childrenStore.children = children
    })
  }
}