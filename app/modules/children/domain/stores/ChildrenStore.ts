import {Child} from "@/app/modules/children/domain/types/Child";
import {singleton} from "tsyringe";
import {makeObservable, observable} from "mobx";

@singleton()
export class ChildrenStore {
  constructor() {
    makeObservable(this)

    this.children.set("bob", {
      id: "1",
      display_name: "Bob Bobby",
      profile_image: null
    })
    this.children.set("fred", {
      id: "2",
      display_name: "Fred Freddy",
      profile_image: null
    })
  }

  @observable
  children = new Map<string, Child>()
}