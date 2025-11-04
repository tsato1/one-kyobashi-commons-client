"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { z } from 'zod';
import { type Locale } from "date-fns/locale"
import { defineStepper } from '@stepperize/react';

import { CustomFormField } from '@/components/forms/custom-form-field';
import { ErrorComponent } from '@/components/error-component';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { genMonths } from '@/components/ui/calendar-i18n';
import { cn } from '@/lib/utils';
import { RootState, useAppDispatch } from '@/state/redux';
import { firstStepSchema, saveStepperData, secondStepSchema } from '@/state/onboardStepperSlice';
import { useGetAuthUserQuery, useUpdateUserMutation } from '@/state/api';

const { useStepper, steps, utils } = defineStepper(
  { id: 'firstStep', label: '規約', schema: firstStepSchema },
  { id: 'secondStep', label: '情報提供', schema: secondStepSchema },
  { id: 'thirdStep', label: '確認', schema: z.object({}) }
);

interface WelcomeStepperProps {
  locale: Locale
}

export const WelcomeStepper = ({
  locale
}: WelcomeStepperProps) => {
  const { data: authUser } = useGetAuthUserQuery();
  const [updateUser] = useUpdateUserMutation();
  const dispatch = useAppDispatch();
  const allStepperData = useSelector((state: RootState) => state.onboardStepper);
  const stepper = useStepper();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm({
    mode: 'onTouched',
    resolver: zodResolver(stepper.current.schema),
  });

  const onSubmit = async (values: z.infer<typeof stepper.current.schema>) => {
    // biome-ignore lint/suspicious/noConsoleLog: <We want to log the form values>
    console.log(`Form values for ${stepper.current.id}:`, values);
    if (stepper.isLast) {
      console.log("Data being sent to server", allStepperData)
      setIsLoading(true);
      await updateUser({
        cognitoId: authUser?.cognitoInfo?.userId,
        ...allStepperData
      });
      window.location.reload();
    } else {
      dispatch(saveStepperData(values))
      stepper.next();
    }
  };

  const currentIndex = utils.getIndex(stepper.current.id);

  if (!authUser) {
    return <ErrorComponent />;
  }

  return (

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Uncomment this to display the current step out of all the steps */}
        {/* <div className="flex justify-between">
              <h2 className="text-lg font-medium">Checkout</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Step {currentIndex + 1} of {steps.length}
                </span>
              </div>
            </div> */}
        <nav aria-label="Onboarding steps" className="group my-10">
          <ol className="flex items-center justify-between gap-2">
            {stepper.all.map((step, index, array) => (
              <React.Fragment key={step.id}>
                <li className="flex items-center gap-4 flex-shrink-0">
                  <Button
                    type="button"
                    role="tab"
                    variant={index <= currentIndex ? 'default' : 'secondary'}
                    aria-current={
                      stepper.current.id === step.id ? 'step' : undefined
                    }
                    aria-posinset={index + 1}
                    aria-setsize={steps.length}
                    aria-selected={stepper.current.id === step.id}
                    className="flex size-10 items-center justify-center rounded-full"
                    onClick={async () => {
                      const valid = await form.trigger();
                      //must be validated
                      if (!valid) return;
                      //can't skip steps forwards but can go back anywhere if validated
                      if (index - currentIndex > 1) return;
                      stepper.goTo(step.id);
                    }}
                  >
                    {index + 1}
                  </Button>
                  <span className={cn("text-sm font-medium", index > currentIndex && "opacity-50")}>
                    {step.label}
                  </span>
                </li>
                {index < array.length - 1 && (
                  <Separator className={`flex-1 ${index < currentIndex ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </React.Fragment>
            ))}
          </ol>
        </nav>
        <div className="space-y-6 sm:space-y-12">
          {stepper.switch({
            firstStep: () => <AgreementComponent />,
            secondStep: () => <InfoComponent locale={locale} />,
            thirdStep: () => <ConfirmationComponent />,
          })}

          <div className="flex justify-between gap-4">
            <Button
              variant="secondary"
              type="button"
              onClick={stepper.prev}
              disabled={stepper.isFirst || isLoading}
            >
              戻る
            </Button>
            <Button type="submit" disabled={isLoading}>
              {stepper.isLast ? '完了！' : '次へ'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

function AgreementComponent() {
  return (
    <div className="space-y-6 text-start">
      <h1 className="text-lg font-medium">ようこそ！All O.K!な活動集団へ！</h1>
      <div className="h-[300px] p-3 border rounded-md overflow-y-scroll">
        ONE京橋コモンズに加わるにあたって
        <br />
        <br />
        規約
        <br />
        規約
        <br />
        規約
        <br />
        規約
        <br />
        規約
        <br />
        規約
        <br />
        規約
        <br />
        規約
        <br />
        規約
        <br />
        規約
        <br />
        規約
        <br />
        規約
        <br />
        規約
      </div>
      <CustomFormField
        name="isTermsAgreed"
        label="同意する"
        type="checkbox"
        initialValue={false}
        disabled={false}
        className="w-fit" />
    </div>
  );
}

interface InfoComponentProps {
  locale: Locale
}

function InfoComponent({
  locale
}: InfoComponentProps) {
  const MONTHS = React.useMemo(() => {
    let iLocale: Pick<Locale, 'options' | 'localize' | 'formatLong'> = locale;
    const { options, localize, formatLong } = iLocale || {};
    if (options && localize && formatLong) {
      iLocale = {
        options,
        localize,
        formatLong,
      };
    }
    return genMonths(iLocale);
  }, [locale]);

  return (
    <div className="space-y-6 text-start">
      <div className="space-y-2 border-l-4 border-accent p-2">
        <CustomFormField
          name="nickname"
          label="ニックネームを教えてください"
          initialValue={""}
          disabled={false} />
        <div className="text-xs font-medium text-gray-700">
          我々はニックネームで呼び合います。どのように呼ばれたいですか？
          <br />
          決めてもらいたい場合は空欄でOKです。自己紹介では多くの情報を盛り込んでください！
        </div>
      </div>
      <div className="space-y-2 border-l-4 border-accent p-2">
        <CustomFormField
          name="birthMonth"
          type="select"
          label="誕生月を教えてください"
          initialValue={undefined}
          options={MONTHS}
          disabled={false} />
        <div className="text-xs font-medium text-gray-700">
          月末にその月の誕生日の方々をお祝いします。
          <br />
          一緒に親交を深めましょう！
        </div>
      </div>
    </div>
  );
}

function ConfirmationComponent() {
  return (
    <div>Todo: 入力の確認</div>
  );
}
