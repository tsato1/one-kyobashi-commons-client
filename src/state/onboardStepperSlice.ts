import { z } from "zod";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const firstStepSchema = z.object({
  isTermsAgreed: z.boolean().refine((val) => val === true, {
    error: "規約に同意しなければなりません。",
  }),
});

export const secondStepSchema = z.object({
  nickname: z
    .string()
    .max(255, 'ニックネームは255文字までです')
    .optional(),
  birthMonth: z
    .coerce.number({ error: "誕生月が選択されていません" })
    .min(0)
    .max(11),
});

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