import { gql } from '@apollo/client';

/* ───────────────── Brands ───────────────── */

export const GET_BRANDS = gql`
  query GetBrands {
    findAllBrands {
      id
      name
    }
  }
`;

/* 
  ───────────────── Models by brand: root-returning arrays ─────────────────

  Your server may expose one of these:
  - findBrandModels(id: ID!/brandId: ID!, sortBy?: String)
  - modelsByBrand(brandId: ID!/Int!)
  - findModelsByBrand(brandId: ID!/Int!)

  We export multiple documents so the page can try them safely.
*/

export const Q_MODELS_ID_WITH_SORT = gql`
  query GetModelsByBrand_ID_WITH_SORT($id: ID!, $sortBy: String!) {
    findBrandModels(id: $id, sortBy: $sortBy) {
      id
      name
      type
      price
      imageUrl
    }
  }
`;

export const Q_MODELS_BRANDID_WITH_SORT = gql`
  query GetModelsByBrand_BRANDID_WITH_SORT($id: ID!, $sortBy: String!) {
    findBrandModels(brandId: $id, sortBy: $sortBy) {
      id
      name
      type
      price
      imageUrl
    }
  }
`;

export const Q_MODELS_ID_NO_SORT = gql`
  query GetModelsByBrand_ID_NO_SORT($id: ID!) {
    findBrandModels(id: $id) {
      id
      name
      type
      price
      imageUrl
    }
  }
`;

export const Q_MODELS_BRANDID_NO_SORT = gql`
  query GetModelsByBrand_BRANDID_NO_SORT($id: ID!) {
    findBrandModels(brandId: $id) {
      id
      name
      type
      price
      imageUrl
    }
  }
`;

export const Q_MODELS_BY_BRAND_ID = gql`
  query ModelsByBrand_ID($brandId: ID!) {
    modelsByBrand(brandId: $brandId) {
      id
      name
      type
      price
      imageUrl
    }
  }
`;

export const Q_MODELS_BY_BRAND_INT = gql`
  query ModelsByBrand_INT($brandId: Int!) {
    modelsByBrand(brandId: $brandId) {
      id
      name
      type
      price
      imageUrl
    }
  }
`;

export const Q_FIND_MODELS_BY_BRAND_ID = gql`
  query FindModelsByBrand_ID($brandId: ID!) {
    findModelsByBrand(brandId: $brandId) {
      id
      name
      type
      price
      imageUrl
    }
  }
`;

export const Q_FIND_MODELS_BY_BRAND_INT = gql`
  query FindModelsByBrand_INT($brandId: Int!) {
    findModelsByBrand(brandId: $brandId) {
      id
      name
      type
      price
      imageUrl
    }
  }
`;

/* 
  ───────────────── Brand object with nested models ─────────────────

  Many schemas expose models nested under a brand node:
    brand(id: …) { models { … } }
    brandById(id: …) { models { … } }
    findUniqueBrand(id: …) { models { … } }
    findBrandById(id: …) { models { … } }
  Sometimes the field is called `guitarModels` or `brandModels`.

  We cover common spellings for both ID and Int argument types.
*/

export const Q_BRAND_ID_MODELS = gql`
  query Brand_ID_Models($id: ID!) {
    brand(id: $id) {
      id
      name
      models { id name type price imageUrl }
    }
  }
`;

export const Q_BRAND_INT_MODELS = gql`
  query Brand_INT_Models($id: Int!) {
    brand(id: $id) {
      id
      name
      models { id name type price imageUrl }
    }
  }
`;

export const Q_BRAND_BY_ID_ID_MODELS = gql`
  query BrandById_ID_Models($id: ID!) {
    brandById(id: $id) {
      id
      name
      models { id name type price imageUrl }
    }
  }
`;

export const Q_BRAND_BY_ID_INT_MODELS = gql`
  query BrandById_INT_Models($id: Int!) {
    brandById(id: $id) {
      id
      name
      models { id name type price imageUrl }
    }
  }
`;

export const Q_FIND_UNIQUE_BRAND_ID_MODELS = gql`
  query FindUniqueBrand_ID_Models($id: ID!) {
    findUniqueBrand(id: $id) {
      id
      name
      models { id name type price imageUrl }
    }
  }
`;

export const Q_FIND_UNIQUE_BRAND_INT_MODELS = gql`
  query FindUniqueBrand_INT_Models($id: Int!) {
    findUniqueBrand(id: $id) {
      id
      name
      models { id name type price imageUrl }
    }
  }
`;

export const Q_FIND_BRAND_BY_ID_ID_MODELS = gql`
  query FindBrandById_ID_Models($id: ID!) {
    findBrandById(id: $id) {
      id
      name
      models { id name type price imageUrl }
    }
  }
`;

export const Q_FIND_BRAND_BY_ID_INT_MODELS = gql`
  query FindBrandById_INT_Models($id: Int!) {
    findBrandById(id: $id) {
      id
      name
      models { id name type price imageUrl }
    }
  }
`;

/* Some APIs name the list `guitarModels`/`brandModels` instead of `models` */

export const Q_BRAND_ID_GUITAR_MODELS = gql`
  query Brand_ID_GuitarModels($id: ID!) {
    brand(id: $id) {
      id
      name
      guitarModels { id name type price imageUrl }
    }
  }
`;

export const Q_BRAND_ID_BRAND_MODELS = gql`
  query Brand_ID_BrandModels($id: ID!) {
    brand(id: $id) {
      id
      name
      brandModels { id name type price imageUrl }
    }
  }
`;

/* ───────────────── Single model details (your original) ───────────────── */

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
