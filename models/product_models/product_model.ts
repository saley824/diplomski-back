class Product {
  id: string;
  name: string;
  description: string;
  price: number;
  createdAt: Date;
  quantity: number;

  constructor(
    id: string,
    name: string,
    description: string,
    price: number,
    createdAt: Date,
    quantity: number
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.createdAt = createdAt;
    this.quantity = quantity;
  }
}
