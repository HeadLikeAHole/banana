import { apiSlice } from '../api/apiSlice.ts';

export interface CreateProductFormData {
  title: string;
  description: string;
  price: number;
  images: FileList;
}

export interface CreateProductResult {
  message: string;
  data: {
    id: number;
  };
}

export interface Product {
  id: number;
  userId: number;
  title: string;
  description: string;
  price: number;
  createdAt: Date,
  updatedAt: Date
}

export const productsAPISlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    createProduct: builder.mutation<CreateProductResult, CreateProductFormData>({
      query: body => {
        const formData = new FormData();
        formData.append('title', body.title);
        formData.append('description', body.description);
        formData.append('price', body.price + '');  // "+ ''" number converts to string
        for (const file of body.images) {
          formData.append('images', file);
        }

        return {
          url: '/api/products',
          method: 'POST',
          body: formData,
        }
      }
    })
  })
});

export const {
  useCreateProductMutation
} = productsAPISlice;