// DTO means Data transfer object is will get shape of data from user or client send to server
export interface AddCartItemDto {
  productId: string;
  colorSelected: string;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

//Important: TS interfaces only check types while coding -> They do not validate real request body at runtime
// So that they does not automatically stop when get the bad data like
/*
{
  "productId": "",
  "colorSelected": "",
  "quantity": -10
}
*/