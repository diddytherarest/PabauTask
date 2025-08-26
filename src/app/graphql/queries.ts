import { gql } from '@apollo/client';

/** Page 1 — brands */
export const GET_BRANDS = gql`
  query GetBrands {
    brands {
      id
      name
      # logoUrl
    }
  }
`;

/** Page 2 — models by brand */
export const GET_MODELS_BY_BRAND = gql`
  query GetModelsByBrand($brandId: ID!) {
    models(brandId: $brandId) {
      id
      name
      type
      price
      imageUrl
    }
  }
`;

export const GET_GUITAR_DETAILS = gql`
  query GetGuitarDetails($id: ID!) {
    guitar(id: $id) {
      id
      name
      price
      year
      imageUrl
      brand { id name }
      specs {
        type
        body
        neck
        scaleLength
        pickups
        strings
      }
      musicians {
        id
        name
        photoUrl
        instrument
        note
      }
    }
  }
`;
