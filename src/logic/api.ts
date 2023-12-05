import { itemType } from "../vite-env"

let productsArray: itemType[] = [
    {"_id": "5356", "1001": "SaleExample", "1002": "Idonknow30", "1003": "", "1004": "", "1005": "Inactivo"},
    {"_id": "1000", "1001": "a", "1002": "Idonknow", "1003": "", "1004": "", "1005": "Activo"},
    {"_id": "0031", "1001": "SaleExample2", "1002": "Idonknow", "1003": "", "1004": "", "1005": "Activo"},
    {"_id": "0200", "1001": "SaleExample23", "1002": "Idonknow30d", "1003": "", "1004": "", "1005": "Activo"},
    {"_id": "2454", "1001": "SaleExsfafas", "1002": "Idonknow30", "1003": "", "1004": "", "1005": "Inactivo"},
]

export const listsAPI = {
    getLists: (request: string): itemType[] => {
      return productsArray
    }
  }