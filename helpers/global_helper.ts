//TODO

const calculateDiscount = (price: number, discount: number) => {
  return getRoundTo2((price * (100 - discount)) / 100);
};

const getUuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const getRoundTo2 = (value: number) => {
  return Math.round(value*100)/100;

};




// function getUuid = () => {
//   return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
//     const r = (Math.random() * 16) | 0;
//     const v = c === "x" ? r : (r & 0x3) | 0x8;
//     return v.toString(16);
//   });
// }

export default {
  calculateDiscount,
  getUuid,
  getRoundTo2
};
