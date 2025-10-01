import { z } from "zod";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { firstStepSchema, secondStepSchema } from '@one-kyobashi-commons/shared';

type FirstStep = z.infer<typeof firstStepSchema>;
type SecondStep = z.infer<typeof secondStepSchema>;
type StepperData = FirstStep & SecondStep;

const initialState: Partial<StepperData> = {};

export const onboardStepperSlice = createSlice({
  name: "onboardStepper",
  initialState,
  reducers: {
    saveStepperData: (
      state,
      action: PayloadAction<Partial<StepperData>>
    ) => {
      return { ...state, ...action.payload }
    },
    resetStepper: () => initialState,
  }
});

export const { saveStepperData } = onboardStepperSlice.actions;
export default onboardStepperSlice.reducer;