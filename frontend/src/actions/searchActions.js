/* eslint-disable import/prefer-default-export */
/* eslint no-shadow: "error" */
import axios from 'axios';
import {
  SEARCH_LIST_FAIL,
  SEARCH_LIST_REQUEST,
  SEARCH_LIST_SUCCESS,
} from '../constants/searchConstants';

const url = 'http://localhost:5000/graphql';

export const search = (searchTerm, sort = 'none') => async (
  dispatch,
) => {
  try {
    dispatch({
      type: SEARCH_LIST_REQUEST,
    });

    const { data } = await axios.post(
      url,
      {
        query: `
                query {
                    searchProduct(searchTerm: "${searchTerm}"){
                      _id
                      name
                      discount
                      price
                      discountedPrice
                      user{
                          _id
                      }
                      image
                      brand{
                          _id
                          name
                      }
                      category{
                          _id
                          name
                      }
                      subcategory{
                          _id
                          name
                      }
                      new
                      countInStock
                      numReviews
                      reviews{
                          name
                          rating
                          comment
                          user
                      }
                      description
                      avgRating
                  }
                }
                `,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    let sortedData;
    if (sort === 'asc') {
      sortedData = data.data.searchProduct.sort(
        (a, b) => a.price - b.price,
      );
    } else if (sort === 'desc') {
      sortedData = data.data.searchProduct.sort(
        (a, b) => b.price - a.price,
      );
    } else {
      sortedData = data.data.searchProduct;
    }

    console.log('searchActions.js');
    console.log(sortedData);

    dispatch({
      type: SEARCH_LIST_SUCCESS,
      payload: sortedData,
    });
  } catch (error) {
    dispatch({
      type: SEARCH_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
