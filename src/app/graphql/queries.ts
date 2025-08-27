import { gql } from '@apollo/client';

export const GET_BRANDS = gql`
  query GetBrands {
    findAllBrands {
      id
      name
    }
  }
`;


export const GET_MODELS_BY_BRAND_ID = gql`
  query GetModelsByBrand_ID($id: ID!) {
    findBrandModels(id: $id) {
      id
      name
      type
      price
      imageUrl
    }
  }
`;

export const GET_MODELS_BY_BRAND_BRANDID = gql`
  query GetModelsByBrand_BRANDID($id: ID!) {
    findBrandModels(brandId: $id) {
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
