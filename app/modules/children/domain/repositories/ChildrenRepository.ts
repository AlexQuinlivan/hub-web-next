import {Child, ChildrenResponse} from "@/app/modules/children/domain/types/Child";
import {authedFetch} from "@/app/utilities/http/authedFetch";
import {singleton} from "tsyringe";

@singleton()
export class ChildrenRepository {

  async getChildren(): Promise<Child[]> {
    const response = await authedFetch("/api/v3/notifications");
    const json = await response.json()
    return json.notifications
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