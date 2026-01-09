import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  theme: 'system'
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload
    }
  }
})

export const { setTheme } = themeSlice.actions

export const selectCurrentTheme = (state) => {
  return state.theme.theme
}

export const themeReducer = themeSlice.reducer