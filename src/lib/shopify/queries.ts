// GraphQL documents for the Storefront API (cart + classic customer accounts).
// Keep fragments small: the site only needs what the drawer and the account pages render.

export const MONEY = `fragment Money on MoneyV2 { amount currencyCode }`;

export const CART = `
  ${MONEY}
  fragment Cart on Cart {
    id
    checkoutUrl
    totalQuantity
    cost { subtotalAmount { ...Money } totalAmount { ...Money } }
    lines(first: 100) {
      edges { node {
        id
        quantity
        cost { totalAmount { ...Money } }
        merchandise { ... on ProductVariant {
          id
          title
          price { ...Money }
          image { url altText }
          product { handle title }
        } }
      } }
    }
  }`;

export const CART_QUERY = `${CART} query GetCart($id: ID!) { cart(id: $id) { ...Cart } }`;
export const CART_CREATE = `${CART} mutation CartCreate($input: CartInput) { cartCreate(input: $input) { cart { ...Cart } userErrors { field message } } }`;
export const CART_LINES_ADD = `${CART} mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ...Cart } userErrors { field message } } }`;
export const CART_LINES_UPDATE = `${CART} mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ...Cart } userErrors { field message } } }`;
export const CART_LINES_REMOVE = `${CART} mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) { cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ...Cart } userErrors { field message } } }`;
export const CART_BUYER_IDENTITY = `${CART} mutation CartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) { cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) { cart { ...Cart } userErrors { field message } } }`;

export const ADDRESS = `fragment Address on MailingAddress { id firstName lastName company address1 address2 city province zip country phone formatted }`;

export const CUSTOMER = `
  ${ADDRESS}
  ${MONEY}
  fragment Customer on Customer {
    id firstName lastName email phone acceptsMarketing
    defaultAddress { ...Address }
    addresses(first: 10) { edges { node { ...Address } } }
    orders(first: 20, sortKey: PROCESSED_AT, reverse: true) { edges { node {
      id orderNumber processedAt financialStatus fulfillmentStatus statusUrl
      totalPrice { ...Money }
      lineItems(first: 20) { edges { node { title quantity variant { image { url altText } } } } }
    } } }
  }`;

export const CUSTOMER_QUERY = `${CUSTOMER} query GetCustomer($token: String!) { customer(customerAccessToken: $token) { ...Customer } }`;
export const CUSTOMER_CREATE = `mutation CustomerCreate($input: CustomerCreateInput!) { customerCreate(input: $input) { customer { id email } customerUserErrors { code field message } } }`;
export const TOKEN_CREATE = `mutation TokenCreate($input: CustomerAccessTokenCreateInput!) { customerAccessTokenCreate(input: $input) { customerAccessToken { accessToken expiresAt } customerUserErrors { code field message } } }`;
export const TOKEN_DELETE = `mutation TokenDelete($token: String!) { customerAccessTokenDelete(customerAccessToken: $token) { deletedAccessToken userErrors { field message } } }`;
export const CUSTOMER_RECOVER = `mutation Recover($email: String!) { customerRecover(email: $email) { customerUserErrors { code field message } } }`;
export const CUSTOMER_UPDATE = `${CUSTOMER} mutation CustomerUpdate($token: String!, $customer: CustomerUpdateInput!) { customerUpdate(customerAccessToken: $token, customer: $customer) { customer { ...Customer } customerUserErrors { code field message } } }`;
export const ADDRESS_CREATE = `${ADDRESS} mutation AddressCreate($token: String!, $address: MailingAddressInput!) { customerAddressCreate(customerAccessToken: $token, address: $address) { customerAddress { ...Address } customerUserErrors { code field message } } }`;
export const ADDRESS_UPDATE = `${ADDRESS} mutation AddressUpdate($token: String!, $id: ID!, $address: MailingAddressInput!) { customerAddressUpdate(customerAccessToken: $token, id: $id, address: $address) { customerAddress { ...Address } customerUserErrors { code field message } } }`;
export const ADDRESS_DELETE = `mutation AddressDelete($token: String!, $id: ID!) { customerAddressDelete(customerAccessToken: $token, id: $id) { deletedCustomerAddressId customerUserErrors { code field message } } }`;
export const ADDRESS_DEFAULT = `mutation AddressDefault($token: String!, $id: ID!) { customerDefaultAddressUpdate(customerAccessToken: $token, addressId: $id) { customer { id } customerUserErrors { code field message } } }`;
