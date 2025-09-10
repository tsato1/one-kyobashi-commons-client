interface ErrorPageProps {
  title?: string
  message: string
}

export const ErrorComponent = ({
  title = "Error",
  message
}: ErrorPageProps) => {
  return (
    <div className="w-full h-full flex items-center justify-center mt-10">
      <h1>{title}</h1>
      <p>{message}</p>
    </div>
  )
}
