interface ErrorPageProps {
  title?: string
  message?: string
}

export const ErrorComponent = ({
  title = "エラー",
  message = "ユーザデータが取得できませんでした。"
}: ErrorPageProps) => {
  return (
    <div className="w-full h-full flex items-center justify-center mt-10">
      <h1>{title}</h1>
      <p>{message}</p>
    </div>
  )
}
