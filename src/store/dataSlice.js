import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Fetch multiple movie categories in a single Redux action
export const fetchMoviesAndShows = createAsyncThunk(
  "movies/fetchMoviesAndShows",
  async () => {
    try {
      const responses = await Promise.all([
        axios.get("/trending/all/week"),
        axios.get("/movie/now_playing"),
        axios.get("/movie/top_rated"),
        axios.get("/tv/top_rated"),
        axios.get("/tv/popular"),
      ]);

      return {
        trending: responses[0].data.results,
        nowPlaying: responses[1].data.results,
        topRatedMovies: responses[2].data.results,
        topRatedTv: responses[3].data.results,
        popularTv: responses[4].data.results,
      };
    } catch (error) {
      throw error.response?.data || "Failed to fetch movies";
    }
  }
);

// Async thunk to fetch recommendations based on dynamic params (explore and id)
export const fetchRecommendations = createAsyncThunk(
    "movies/fetchRecommendations",
    async ({ explore, id }, thunkAPI) => {
      try {
        const response = await Promise.all([
            axios.get(`/${explore}/${id}/recommendations`),
            axios.get(`/${explore}/${id}/similar`)
        ]);
        
        return {
            recommended: response[0].data.results,
            similar: response[1].data.results
        }
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data || "Failed to fetch recommendations"
        );
      }
    }
  );

// ✅ Create Redux Slice
const dataSlice = createSlice({
  name: "MoviesAndShows",
  initialState: {
    trending: [],
    nowPlaying: [],
    topRatedMovies: [],
    topRatedTv: [],
    popularTv: [],
    recommended: [],
    similar:[],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      // Movies & Shows
      .addCase(fetchMoviesAndShows.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMoviesAndShows.fulfilled, (state, action) => {
        state.loading = false;
        state.trending = action.payload.trending;
        state.nowPlaying = action.payload.nowPlaying;
        state.topRatedMovies = action.payload.topRatedMovies;
        state.topRatedTv = action.payload.topRatedTv;
        state.popularTv = action.payload.popularTv;
      })
      .addCase(fetchMoviesAndShows.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Recommendations
      .addCase(fetchRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.recommended = action.payload.recommended;
        state.similar = action.payload.similar;
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dataSlice.reducer;
