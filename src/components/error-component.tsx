interface ErrorPageProps {
  title?: string
  message: string
}

export const ErrorComponent = ({
  title = "Error",
  message
}: ErrorPageProps) => {
  return (
    <div className="w-full h-full mt-10">
      <h1>{title}</h1>
      <p>{message}</p>
    </div>
  )
}
