import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FormDataEntry {
  id: string;
  name: string;
  age: number;
  email: string;
  password: string;
  gender: string;
  termsAccepted: boolean;
  profileImage: string | null;
  country: string;
  source: 'uncontrolled' | 'hookForm';
  timestamp: number;
}

interface FormDataState {
  entries: FormDataEntry[];
  latestEntryId: string | null;
}

const initialState: FormDataState = {
  entries: [],
  latestEntryId: null,
};

export const formDataSlice = createSlice({
  name: 'formData',
  initialState,
  reducers: {
    addFormData: (state, action: PayloadAction<FormDataEntry>) => {
      state.entries.push(action.payload);
      state.latestEntryId = action.payload.id;
    },
    clearLatestEntry: state => {
      state.latestEntryId = null;
    },
  },
});

export const { addFormData, clearLatestEntry } = formDataSlice.actions;
export default formDataSlice.reducer;
