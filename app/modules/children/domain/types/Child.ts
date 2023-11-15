export interface Child {
  id: string
  display_name: string
  profile_image: string | null
}

export interface ChildrenResponse {
  children: Child[]
}

export interface ChildResponse {
  child: Child
}