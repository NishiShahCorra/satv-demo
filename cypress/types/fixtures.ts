export interface Fixtures {
    auth: Auth
    registration: Registration
    plp: Plp
    search: Search
    pdp: PDP
    login: Auth
    checkout: Checkout
    cartData: Cart
    urls: any
}

export interface Auth {
    username: string
    password: string
}

export interface Checkout {
    streetAddress: string
    city: string
    phoneNumber: string
    state: string
}

export interface Cart {
    firstName: string
    lastName: string
    street1: string
    street2: string
    postcode: string
    region: string
    telephone: string
    country: string
    shippingAddressType: string
}

export interface PDP {
    productUrl: string
}

export interface Plp {
    categoryUrl: string
    plpUrl: string
    categoryName: string
    plpCategoryApiInput: string
    urls: any
}

export interface Registration {
    firstname: string
    lastname: string
    email: string
    password: string
}

export interface Search {
    keyword: string
    searchResultHeader: string
}
