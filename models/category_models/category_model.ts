class Category {
  name: string;
  id: string;
  superCategoryId?: string;

  constructor(name: string, id: string, superCategoryId?: string) {
    this.name = name;
    this.id = id;
    this.superCategoryId = superCategoryId;
  }
}
