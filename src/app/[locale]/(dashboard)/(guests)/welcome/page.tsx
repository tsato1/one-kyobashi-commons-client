"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useLocale } from 'next-intl';
import { type Locale, enUS, ja } from "date-fns/locale"
import { defineStepper } from '@stepperize/react';

import { CustomFormField } from '@/components/forms/custom-form-field';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { genMonths } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { NavbarWelcome } from './_components/navbar-welcome';
import { CircleQuestionMarkIcon } from 'lucide-react';

const agreementSchema = z.object({
  agreed: z.boolean().refine((val) => val === true, {
    message: "規約に同意しなければなりません。",
  }),
});

const infoSchema = z.object({
  role: z.enum(["crew", "trustee"], { message: "役割を選んでください" }),
  nickname: z.string().min(1, 'ニックネームが入力されていません').max(255, 'ニックネームは255文字までです'),
  birthMonth: z.coerce.number().min(0).max(11),
});

type RoleFormValues = z.infer<typeof agreementSchema>;
type InfoFormValues = z.infer<typeof infoSchema>;

const { useStepper, steps, utils } = defineStepper(
  { id: 'agreement', label: '規約', schema: agreementSchema },
  { id: 'info', label: '情報提供', schema: infoSchema },
  { id: 'complete', label: '完了', schema: z.object({}) }
);

const WelcomePage = () => {
  const locale = useLocale();

  const stepper = useStepper();

  const form = useForm({
    mode: 'onTouched',
    resolver: zodResolver(stepper.current.schema),
  });

  const onSubmit = (values: z.infer<typeof stepper.current.schema>) => {
    // biome-ignore lint/suspicious/noConsoleLog: <We want to log the form values>
    console.log(`Form values for step ${stepper.current.id}:`, values);
    if (stepper.isLast) {
      stepper.reset();
    } else {
      stepper.next();
    }
  };

  const currentIndex = utils.getIndex(stepper.current.id);

  return (
    <div className='w-full sm:w-[550px] mx-auto mt-20 sm:mt-24'>
      <NavbarWelcome />
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
              agreement: () => <AgreementComponent />,
              info: () => <InfoComponent locale={locale === "ja" ? ja : enUS} />,
              complete: () => <CompleteComponent />,
            })}
            {!stepper.isLast ? (
              <div className="flex justify-between gap-4">
                <Button
                  variant="secondary"
                  onClick={stepper.prev}
                  disabled={stepper.isFirst}
                >
                  戻る
                </Button>
                <Button type="submit">
                  {stepper.isLast ? '完了！' : '次へ'}
                </Button>
              </div>
            ) : (
              <Button onClick={stepper.reset}>最初へ</Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}

function AgreementComponent() {
  return (
    <div className="space-y-6 text-start">
      <h1 className="text-lg font-medium">ようこそ！All O.K!な活動集団へ！</h1>
      <div className="h-[300px] p-3 border rounded-md overflow-y-scroll">
        ONE京橋コモンズに入るにあたって
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
        name="agreed"
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
          name="role"
          label="あなたの興味のある役割を教えてください"
          type="select"
          initialValue={"crew"}
          options={[
            { value: "crew", label: "クルー" },
            { value: "trustee", label: "一味" }
          ]}
          disabled={false}
          className="w-fit" />
        <div className="flex items-center text-blue-500 cursor-pointer">
          <CircleQuestionMarkIcon className="w-4 h-4 mr-1" />
          <p className="text-sm underline underline-offset-4">役割とは</p>
        </div>
        <div className="text-xs font-medium text-gray-700">
          <br />
          興味に応じて後で自由に変更することができます。
        </div>
      </div>
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
          initialValue={""}
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

function CompleteComponent() {
  return (
    <div className="text-center">
      ありがとうございます！
      <br />
      自己紹介の準備をしていてくださいね！
      <br />
      <br />
      追って連絡を差し上げますm(_ _)m
    </div>
  );
}

export default WelcomePage;
