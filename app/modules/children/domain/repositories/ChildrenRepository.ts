import {Child, ChildrenResponse} from "@/app/modules/children/domain/types/Child";
import {singleton} from "tsyringe";

@singleton()
export class ChildrenRepository {

  async getChildren(): Promise<Child[]> {
    const response = await fetch("/children");
    return (await response.json() as ChildrenResponse).children
  }

  async createChild(name: string) {
    await fetch("/children", {
      method: "POST",
      body: JSON.stringify({name: name}),
      headers: {
        "Content-Type": "application/json"
      }
    })
  }
}