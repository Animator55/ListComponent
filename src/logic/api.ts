import { itemType } from "../vite-env"

let productsArray: itemType[] = [
    {"_id": "5356", "Image": "#d7d7d7", "Nombre": "SaleExample", "Tipo": "Idonknow30", "Descripción": "", "Tags": [], "Estado": "Inactivo"},
    {"_id": "0000", "Image": "#d7d7d7", "Nombre": "a", "Tipo": "Idonknow", "Descripción": "", "Tags": [], "Estado": "Activo"},
    {"_id": "0031", "Image": "#d7d7d7", "Nombre": "SaleExample2", "Tipo": "Idonknow", "Descripción": "", "Tags": [], "Estado": "Activo"},
    {"_id": "0200", "Image": "#d7d7d7", "Nombre": "SaleExample23", "Tipo": "Idonknow30d", "Descripción": "", "Tags": [], "Estado": "Activo"},
    {"_id": "2454", "Image": "#d7d7d7", "Nombre": "SaleExsfafas", "Tipo": "Idonknow30", "Descripción": "", "Tags": [], "Estado": "Inactivo"},
]

export const listsAPI = {
    getLists: (request: string): itemType[] => {
      return productsArray
    }
  }