// src/app/graphql/queries.ts
import { gql } from '@apollo/client';

/** Home page: list of brands */
export const GET_BRANDS = gql`
  query GetBrands {
    findAllBrands {
      id
      name
    }
  }
`;

/** Primary: many backends expose brand(id: ID!) { models { ... } } */
export const Q_BRAND_MODELS_SIMPLE = gql`
  query BrandModelsSimple($id: ID!) {
    brand(id: $id) {
      id
      name
      models {
        id
        name
        type
        price
        year
        imageUrl
        description
      }
    }
  }
`;

/** Fallback: some schemas type the argument as Int! instead of ID! */
export const Q_BRAND_MODELS_SIMPLE_INT = gql`
  query BrandModelsSimpleInt($id: Int!) {
    brand(id: $id) {
      id
      name
      models {
        id
        name
        type
        price
        year
        imageUrl
        description
      }
    }
  }
`;

/** Details for a single model (for /models/[id]) */
export const GET_GUITAR_DETAILS = gql`
  query GetGuitarDetails($id: ID!) {
    findUniqueModel(id: $id) {
      id
      name
      price
      year
      imageUrl
      brand { id name }
      specs { type body neck scaleLength pickups strings }
      musicians { id name photoUrl instrument note }
    }
  }
`;
