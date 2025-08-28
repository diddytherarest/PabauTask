import { gql } from '@apollo/client';

export const GET_BRANDS = gql`
  query GetBrands {
    findAllBrands {
      id
      name
    }
  }
`;

/**
 * Fetch models for a brand by ID only (no server-side sort).
 * Alias `image` -> `imageUrl` so the UI can keep using `imageUrl`.
 */
export const Q_FIND_BRAND_MODELS = gql`
  query FindBrandModels($id: ID!) {
    findBrandModels(id: $id) {
      id
      name
      type
      price
      imageUrl: image
    }
  }
`;

/**
 * Details query (safe subset). `image` is aliased to `imageUrl`.
 */
export const GET_GUITAR_DETAILS = gql`
  query GetGuitarDetails($id: ID!) {
    findUniqueModel(id: $id) {
      id
      name
      price
      imageUrl: image
      brand { id name }
      specs {
        body
        neck
        scaleLength
        pickups
        strings
      }
      musicians {
        id
        name
        instrument
        note
        photoUrl
      }
    }
  }
`;
