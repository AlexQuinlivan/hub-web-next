import {Child, ChildrenResponse} from "@/app/modules/children/domain/types/Child";
import {authedFetch} from "@/app/utilities/http/authedFetch";
import {AuthedHttpClient, HttpClient} from "@/app/utilities/http/HttpClient";
import {inject, singleton} from "tsyringe";

@singleton()
export class ChildrenRepository {

  constructor(
    @inject(AuthedHttpClient) private readonly httpClient: AuthedHttpClient
  ) {
  }

  async getChildren(): Promise<Child[]> {
    const { data } = await this.httpClient.get<any>("/api/v3/notifications");
    return data.notifications
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