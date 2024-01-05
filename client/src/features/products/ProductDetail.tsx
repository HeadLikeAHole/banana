import { LoaderFunctionArgs, useLoaderData, useNavigation } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

import { server } from '../../config.ts';

export async function loader({ params }: LoaderFunctionArgs) {
  const response = await fetch(`${server}/api/products/${params.productID}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const responseData = await response.json();
    if (responseData.errors) {
      return responseData.errors
    }
    throw new Error(responseData.message)
  }

  return await response.json();
}


export default function ProductDetail() {
  const { data } = useLoaderData();
  const navigation = useNavigation();
  console.log(data)

  return (
    <Grid container spacing={2}>
      <Grid item xs={8}>
        <ImageList variant="masonry" cols={3} gap={8}>
          {data.images.map((item) => (
            <ImageListItem key={item.img}>
              <img
                srcSet={`${item.path}?w=248&fit=crop&auto=format&dpr=2 2x`}
                src={`${server}${item.path}?w=248&fit=crop&auto=format`}
                alt={item.title}
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Grid>
      <Grid item xs={4}>
      </Grid>
    </Grid>
  );
}