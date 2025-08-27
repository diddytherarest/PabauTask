import { gql } from '@apollo/client';

export const GET_BRANDS = gql`
  query GetBrands {
    findAllBrands {
      id
      name
    }
  }
`;

export const GET_MODELS_BY_BRAND = gql`
  query GetModelsByBrand($id: ID!, $sortBy: SortBy!) {
    findBrandModels(id: $id, sortBy: $sortBy) {
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
    findUniqueModel(id: $id) {
      id
      name
      price
      year
      imageUrl
      brand {
        id
        name
      }
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
